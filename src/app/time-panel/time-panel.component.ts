import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity-panel/activity.service';
import { ActivityLoopEntry } from '../game-state/activity';
import { Character } from '../game-state/character';
import { CharacterService } from '../game-state/character.service';
import { GameStateService } from '../game-state/game-state.service';
import { Home } from '../game-state/home';
import { HomeService } from '../game-state/home.service';
import { InventoryService } from '../game-state/inventory.service';
import { LogService } from '../log-panel/log.service';
import { MainLoopService } from '../main-loop.service';


@Component({
  selector: 'app-time-panel',
  templateUrl: './time-panel.component.html',
  styleUrls: ['./time-panel.component.less']
})
export class TimePanelComponent implements OnInit {
  character: Character;

  currentLoopEntry?: ActivityLoopEntry = undefined;
  currentIndex = 0;
  currentTickCount = 0;
  pause = false;

  constructor(
    private mainLoopService: MainLoopService,
    public activityService: ActivityService,
    characterService: CharacterService,
    private homeService: HomeService,
    private logService: LogService,
    private gameStateService: GameStateService,
    private inventoryService: InventoryService
  ) {
    this.character = characterService.characterState;
  }

  ngOnInit(): void {
    this.mainLoopService.tickSubject.subscribe(
      (next) => {
        if (!this.pause){
          const loopEntries = this.activityService.activityLoop;
          if (loopEntries.length > 0 && this.currentIndex < loopEntries.length) {
            this.currentLoopEntry = loopEntries[this.currentIndex];
            this.currentLoopEntry.activity.consequence();
            this.homeService.home.consequence();
            this.character.age++;
            this.character.status.nourishment.value--;
            this.inventoryService.eatFood();
            //this.logService.addLogMessage("You spend the day doing " + this.currentLoopEntry.activity.name);
            // check for death
            if (this.character.age >= this.character.lifespan){
              this.logService.addLogMessage("You reach the end of your natural life and pass away from old age. You have failed to achieve immortality and your life has ended. Don't worry, I'm sure you'll achieve immortality in your next life.");
              this.gameStateService.reincarnate();
            }
            if (this.character.status.health.value <= 0){
              this.logService.addLogMessage("You succumb to your wounds and pass away. You have failed to achieve immortality and your life has ended. Don't worry, I'm sure you'll achieve immortality in your next life.");
              this.gameStateService.reincarnate();
            }
            if (this.character.status.nourishment.value <= 0){
              this.logService.addLogMessage("You starve to death. You have failed to achieve immortality and your life has ended. Don't worry, I'm sure you'll achieve immortality in your next life.");
              this.gameStateService.reincarnate();
            }
            // check for exhaustion
            if (this.character.status.stamina.value < 0){
              // take 5 days to recover, regain stamina, restart loop
              this.logService.addLogMessage("You collapse to the ground, completely exhausted. It takes you 5 days to recover enough to work again.");
              this.character.age += 5;
              this.character.status.stamina.value = this.character.status.stamina.max;
              this.currentTickCount = 0;
              this.currentIndex = 0;
            }
            if (this.currentTickCount < this.currentLoopEntry.repeatTimes - 1) {
              this.currentTickCount++;
            } else {
              this.currentIndex++;
              this.currentTickCount = 0;
              if (this.currentIndex == loopEntries.length) {
                this.currentIndex = 0;
              }
            }
          } else {
            // make sure that we reset the current index if activities get removed below the currentIndex
            this.currentIndex = 0;
          }
        }
      }
    )
  }

  pauseClick(){
    this.pause = !this.pause;
  }

  onPlusClick(entry: ActivityLoopEntry): void{
    entry.repeatTimes++;
  }

  onMinusClick(entry: ActivityLoopEntry): void{
    entry.repeatTimes--;
  }

  onUpClick(entry: ActivityLoopEntry): void{
    const loopEntries = this.activityService.activityLoop;
    let index = loopEntries.indexOf(entry);
    if (index != 0 && loopEntries.length > 1){
      let swapper = loopEntries[index - 1];
      loopEntries[index - 1] = entry;
      loopEntries[index] = swapper;
    }
  }

  onDownClick(entry: ActivityLoopEntry): void{
    const loopEntries = this.activityService.activityLoop;
    let index = loopEntries.indexOf(entry);
    if (index != loopEntries.length - 1 && loopEntries.length > 1){
      let swapper = loopEntries[index + 1];
      loopEntries[index + 1] = entry;
      loopEntries[index] = swapper;
    }
  }

  onRemoveClick(entry: ActivityLoopEntry): void{
    const loopEntries = this.activityService.activityLoop;
    let index = loopEntries.indexOf(entry);
    // make sure we're not running past the end of the entries array
    if (this.currentIndex >= loopEntries.length - 1){
      this.currentIndex = 0;
    }
    loopEntries.splice(index,1);
  }

}