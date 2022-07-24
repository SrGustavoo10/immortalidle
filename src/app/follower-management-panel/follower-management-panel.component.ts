import { Component, OnInit } from '@angular/core';
import { FollowersService } from '../game-state/followers.service';

@Component({
  selector: 'app-follower-management-panel',
  templateUrl: './follower-management-panel.component.html',
  styleUrls: ['./follower-management-panel.component.less', '../app.component.less']
})
export class FollowerManagementPanelComponent implements OnInit {

  changeAll = 0;
  constructor(public followerService: FollowersService) { }

  ngOnInit(): void {
    let a;
  }
  
  changeAllChanged(event: Event){
    if (!(event.target instanceof HTMLInputElement)) return;
    this.changeAll = parseInt(event.target.value);
  }

  changeAllClicked(){
    for(const key in this.followerService.jobs){
      this.followerService.setMaxFollowers(key, this.changeAll);
    }
  }

  sortOrderChanged(event: Event){
    if (!(event.target instanceof HTMLSelectElement)) return;
    this.followerService.followerSortOrder = event.target.value;
    this.followerService.sortFollowers();
  }

  keepValueChanged(event: Event, job: string){
    if (!(event.target instanceof HTMLInputElement)) return;
    this.followerService.setMaxFollowers(job, parseInt(event.target.value));
  }
}
