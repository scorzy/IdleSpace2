import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Bonus } from "src/app/model/bonus/bonus";

@Component({
  selector: "app-storage",
  templateUrl: "./storage.component.html",
  styleUrls: ["./storage.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Unit;
  hasMulti = false;

  ngOnInit() {
    this.reloadHasMulti();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.reloadHasMulti();
      })
    );
    super.ngOnInit();
  }
  reloadHasMulti() {
    this.hasMulti = this.unit.limitStackMulti?.bonuses.some((limit) =>
      limit.unit.quantity.gt(0)
    );
  }

  getBonusId(index: number, bonus: Bonus) {
    return bonus.unit.id;
  }
}
