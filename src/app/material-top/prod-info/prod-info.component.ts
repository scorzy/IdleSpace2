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
import { ZERO } from "src/app/model/CONSTANTS";
import { Production } from "src/app/model/units/production";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { IColumnItem } from "src/app/model/utility/iColumnItem";

@Component({
  selector: "app-prod-info",
  templateUrl: "./prod-info.component.html",
  styleUrls: ["./prod-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProdInfoComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() unit: Unit;
  totalProd: Decimal;
  totalConsumed: Decimal;
  data: Array<Production>;
  sortNameOrder = null;
  sortProdOrder = null;
  showTable = true;

  listOfColumns: IColumnItem[] = [
    {
      name: "Name",
      sortOrder: null,
      sortFn: (a: Production, b: Production) =>
        a.producer.name > b.producer.name ? 1 : -1,
      filterMultiple: false
    },
    {
      name: "Prod",
      sortOrder: null,
      sortFn: (a: Production, b: Production) => a.prodPerSec.cmp(b.prodPerSec),
      filterMultiple: false
    }
  ];
  ngOnInit() {
    this.showTable = !!this.unit.makers.find((m) => m.producer.quantity.gt(0));
    this.getData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.showTable = !!this.unit.makers.find((m) => m.producer.quantity.gt(0));
    this.getData();
  }

  getData() {
    this.totalProd = this.unit.makers
      .filter((p) => p.ratio.gt(0) && p.producer.quantity.gt(0))
      .map((p) => p.prodPerSec.times(p.producer.quantity))
      .reduce((p, c) => p.plus(c), ZERO);

    this.totalConsumed = this.unit.makers
      .filter((p) => p.ratio.lt(0) && p.producer.quantity.gt(0))
      .map((p) => p.prodPerSec.times(p.producer.quantity))
      .reduce((p, c) => p.plus(c), ZERO);

    this.data = this.unit.makers.filter((m) => m.producer.quantity.gt(0));
  }
}
