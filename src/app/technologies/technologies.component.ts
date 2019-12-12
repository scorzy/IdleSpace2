import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "../main.service";
import { Technology } from "../model/researches/technology";
import { Subscription } from "rxjs";

@Component({
  selector: "app-technologies",
  templateUrl: "./technologies.component.html",
  styleUrls: ["./technologies.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologiesComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

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
    this.ms.game.researchManager.unlockedTechnologies.forEach(t =>
      t.reloadUi()
    );
  }
  getTechId(index: number, tech: Technology) {
    return tech.id;
  }
}
