import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Game } from "src/app/model/game";

@Component({
  selector: "app-sub-table",
  templateUrl: "./sub-table.component.html",
  styleUrls: ["./sub-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubTableComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @Input() data: Production;
  @Input() unit: Unit;
  @Input() positiveOnly = false;
  subData: Array<{
    icon: string;
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
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.subData = this.getSubData();
  // }
  getSubData(): Array<{
    icon: string;
    what: string;
    quantity: Decimal;
    effect: Decimal;
    total: Decimal;
  }> {
    let ret = new Array<{
      icon: string;
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
        (bon) =>
          bon.unit.quantity.gt(0) &&
          (!bon.secondMultiplier || bon.secondMultiplier.quantity.gt(0))
      )
      .map((bonus) => {
        const bon = {
          icon: "",
          what: bonus.unit.name,
          // (bonus.secondMultiplier ? " " + bonus.secondMultiplier.name : ""),
          quantity: bonus.unit.quantity.times(
            bonus.secondMultiplier ? bonus.secondMultiplier.quantity : 1
          ),
          effect: Decimal.times(bonus.multiplier, 100),
          total: bonus.getBonus().times(100).minus(100)
        };

        bon.icon = Game.GetClassIcon(bonus.unit);
        return bon;
      });

    return ret;
  }
}
