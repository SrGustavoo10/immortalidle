import { Component, OnInit } from '@angular/core';
import { Home } from '../game-state/home';
import { Character } from '../game-state/character';
import { CharacterService } from '../game-state/character.service';
import { HomeService } from '../game-state/home.service';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrls: ['./home-panel.component.less']
})

export class HomePanelComponent implements OnInit {

  character: Character;

  constructor(public characterService: CharacterService,
    public homeService: HomeService) {
    this.character = characterService.characterState;
  }

  ngOnInit(): void {
  }

  upgradeClick(){
    this.homeService.upgradeToNextHome();
  }

  buyClick(){
    this.character.money -= 100;
    this.character.land += 1;
  }
}