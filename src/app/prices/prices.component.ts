import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  Input
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { Unit } from "../model/units/unit";
import { Price } from "../model/prices/price";
import { ONE } from "../model/CONSTANTS";

@Component({
  selector: "app-prices",
  templateUrl: "./prices.component.html",
  styleUrls: ["./prices.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricesComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Unit;
  @Input() quantity: Decimal = ONE;
  ngOnInit() {
    // super.ngOnInit();
    this.unit.buyPrice.prices.forEach((pri) =>
      pri.reloadNum(this.unit.manualBought, this.quantity)
    );

    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.unit.buyPrice.prices.forEach((pri) =>
          pri.reloadNum(this.unit.manualBought, this.quantity)
        );
        this.cd.markForCheck();
      })
    );
  }
  getPriceId(index: number, pri: Price) {
    return index + pri.spendable.id;
  }
}
