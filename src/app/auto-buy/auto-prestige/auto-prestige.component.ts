import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-auto-prestige",
  templateUrl: "./auto-prestige.component.html",
  styleUrls: ["./auto-prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoPrestigeComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  minutes = 0;
  hours = 0;

  ngOnInit() {
    this.minutes =
      (this.ms.game.automationManager.autoPrestige.maxTime / 1000 / 60) % 60;
    this.hours = Math.floor(
      this.ms.game.automationManager.autoPrestige.maxTime / (1000 * 60 * 60)
    );
    super.ngOnInit();
  }
  getTime(): number {
    return (Date.now() - this.ms.game.lastPrestigeTime) / 1000;
  }
  setInterval() {
    this.ms.game.automationManager.autoPrestige.maxTime =
      (this.hours * 60 + this.minutes) * 60 * 1000;
  }
}
