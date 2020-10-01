import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Technology } from "../model/researches/technology";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-technologies",
  templateUrl: "./technologies.component.html",
  styleUrls: ["./technologies.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologiesComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
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
