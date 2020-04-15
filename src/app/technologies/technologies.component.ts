import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { Technology } from "../model/researches/technology";
import { Subscription } from "rxjs";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-technologies",
  templateUrl: "./technologies.component.html",
  styleUrls: ["./technologies.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologiesComponent extends BaseComponentComponent {
  ngOnInit() {
    this.reloadUi();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.reloadUi();
        this.cd.markForCheck();
      })
    );
  }
  reloadUi() {
    this.ms.game.researchManager.unlockedTechnologies.forEach((t) =>
      t.reloadUi()
    );
  }
  getTechId(index: number, tech: Technology) {
    return tech.id;
  }
}
