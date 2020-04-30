import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-sub-table",
  templateUrl: "./sub-table.component.html",
  styleUrls: ["./sub-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubTableComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @Input() data: Production;
  @Input() unit: Unit;
  @Input() positiveOnly = false;
  subData: Array<{
    what: string;
    quantity: Decimal;
    effect: Decimal;
    total: Decimal;
  }>;
  ngOnInit() {
    this.subData = this.getSubData();
  }
  getIndex(index: number, a: any) {
    return index;
  }
  getSubData(): Array<{
    what: string;
    quantity: Decimal;
    effect: Decimal;
    total: Decimal;
  }> {
    let ret = new Array<{
      what: string;
      quantity: Decimal;
      effect: Decimal;
      total: Decimal;
    }>();

    ret = (this.positiveOnly
      ? this.unit.prodEfficiency.bonuses
      : this.unit.prodAllBonus.bonuses
    )
      .filter(
        (bon) => !bon.secondMultiplier || bon.secondMultiplier.quantity.gt(0)
      )
      .map((bonus) => {
        return {
          what:
            bonus.unit.name +
            (bonus.secondMultiplier ? " " + bonus.secondMultiplier.name : ""),
          quantity: bonus.unit.quantity.times(
            bonus.secondMultiplier ? bonus.secondMultiplier.quantity : 1
          ),
          effect: bonus.multiplier.times(100),
          total: bonus.multiplier
            .times(bonus.unit.quantity)
            .times(100)
            .plus(100)
        };
      });

    return ret;
  }
}
