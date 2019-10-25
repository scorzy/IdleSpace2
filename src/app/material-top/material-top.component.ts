import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";
import { Subscription } from "rxjs";
import { fadeIn } from "../animations";

@Component({
  selector: "app-material-top",
  templateUrl: "./material-top.component.html",
  styleUrls: ["./material-top.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class MaterialTopComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getId(index: number, mat: Unit) {
    return mat.id;
  }
}
