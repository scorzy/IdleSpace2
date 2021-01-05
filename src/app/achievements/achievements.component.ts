import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";
import { Achievement } from "../model/achievements/achievement";

@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AchievementsComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit(): void {}

  getGroupId(index: number, group: any) {
    return group.id;
  }
  getAckId(index: number, ack: Achievement) {
    return ack.id;
  }
}
