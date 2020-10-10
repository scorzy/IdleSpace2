import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  Input
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { MainService } from "src/app/main.service";
import { Challenge } from "src/app/model/challenge/challenge";
import { OptionsService } from "src/app/options.service";
import { convertToRoman } from "ant-utils";
@Component({
  selector: "app-challenge",
  templateUrl: "./challenge.component.html",
  styleUrls: ["./challenge.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() challenge: Challenge;
  @Input() noRoute = false;
  romanNum = "";
  constructor(
    ms: MainService,
    public os: OptionsService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(ms, cd);
  }

  ngOnInit() {
    super.ngOnInit();
    this.ms.game.shipyardManager.designerView = true;
    this.ms.game.shipyardManager.postUpdate();
    if (!this.noRoute)
      this.subscriptions.push(
        this.route.paramMap.subscribe((paramMap) =>
          this.getChallenge(paramMap.get("id"))
        )
      );
  }
  getChallenge(id: string) {
    this.challenge = this.ms.game.challengeManager.challenges.find(
      (c) => c.id === id
    );
    this.romanNum = "";
    if (this.challenge.quantity.gt(1)) {
      this.romanNum = convertToRoman(this.challenge.quantity.plus(1));
    }
    this.cd.markForCheck();
  }
  startChallenge() {
    this.ms.game.startChallenge(this.challenge);
  }
  stopStartChallenge() {
    this.ms.game.quitChallenge();
    this.startChallenge();
  }
}
