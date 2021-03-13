import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MainService } from "../main.service";
import { Achievement } from "../model/achievements/achievement";

@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AchievementsComponent implements OnInit {
  constructor(public ms: MainService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}
  public clip(ack: Achievement) {
    return this.sanitizer.bypassSecurityTrustStyle(
      "inset(" + ack.percent + "% 0px 0px"
    );
  }
  getGroupId(index: number, group: any) {
    return group.id;
  }
  getAckId(index: number, ack: Achievement) {
    return ack.id;
  }
}
