import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Production } from "src/app/model/units/production";
import { ONE } from "src/app/model/CONSTANTS";
import { Unit } from "src/app/model/units/unit";

@Component({
  selector: "app-sub-table",
  templateUrl: "./sub-table.component.html",
  styleUrls: ["./sub-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubTableComponent implements OnInit {
  @Input() data: Production;
  @Input() unit: Unit;

  subData: Array<{
    what: string;
    quantity: Decimal;
    effect: DecimalSource;
    total: DecimalSource;
  }>;

  constructor() {}

  ngOnInit() {
    this.subData = this.getSubData(this.data);
  }
  getIndex(index: number, a: any) {
    return index;
  }
  getSubData(
    prod: Production
  ): Array<{
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

    ret.push({
      what: "Operativity",
      quantity: ONE,
      effect: ONE,
      total: new Decimal(this.unit.operativity)
    });

    ret = ret.concat(
      prod.producer.prodEfficiency.bonuses
        .concat(prod.producer.prodAllBonus.bonuses)
        .concat(prod.product.prodBy.bonuses)
        .map(bonus => {
          return {
            what: bonus.unit.name,
            quantity: bonus.unit.quantity,
            effect: bonus.multiplier,
            total: bonus.multiplier.times(bonus.unit.quantity)
          };
        })
    );

    return ret;
  }
}
