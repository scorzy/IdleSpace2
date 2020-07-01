import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  getMultiplierClass() {
    if (
      this.ms.game.prestigeManager.nextPrestigeMultiplier.gt(
        this.ms.game.prestigeManager.prestigeMultiplier
      )
    ) {
      return "text-success";
    }
    if (
      this.ms.game.prestigeManager.nextPrestigeMultiplier.lt(
        this.ms.game.prestigeManager.prestigeMultiplier
      )
    ) {
      return "text-error";
    }
    return "";
  }
}
