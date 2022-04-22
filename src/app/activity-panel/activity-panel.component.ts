import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../game-state/game-state.service';
import { ActivityService } from './activity.service';
import { CharacterService } from '../game-state/character.service';
import { Activity } from '../game-state/activity';
import { Character } from '../game-state/character';

@Component({
  selector: 'app-activity-panel',
  templateUrl: './activity-panel.component.html',
  styleUrls: ['./activity-panel.component.less']
})
export class ActivityPanelComponent implements OnInit {

  character: Character;

  constructor(
    public gameStateService: GameStateService,
    public activityService: ActivityService,
    characterService: CharacterService
  ) {
    this.character = characterService.characterState;
  }

  ngOnInit(): void {
  }

  onClick(activity: Activity){
    this.activityService.activityLoop.push({
      activity: activity,
      repeatTimes: 1
    });
  }

  meetsRequirements(activity: Activity): boolean {
    return this.activityService.meetsRequirements(activity);
  }
}