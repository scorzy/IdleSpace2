import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { ZERO } from "src/app/model/CONSTANTS";
import { Production } from "src/app/model/units/production";

@Component({
  selector: "app-prod-info",
  templateUrl: "./prod-info.component.html",
  styleUrls: ["./prod-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProdInfoComponent implements OnInit {
  @Input() unit: Unit;

  totalProd: Decimal;
  totalConsumed: Decimal;
  data: Array<Production>;
  sortName: string | null = null;
  sortValue: string | null = null;
  showTable = true;

  constructor() {}

  ngOnInit() {
    this.showTable = !!this.unit.makers.find(m => m.producer.quantity.gt(0));
    this.getData();
  }

  getData() {
    this.totalProd = this.unit.makers
      .filter(p => p.ratio.gt(0))
      .map(p => p.prodPerSec)
      .reduce((p, c) => p.plus(c), ZERO);

    this.totalConsumed = this.unit.makers
      .filter(p => p.ratio.lt(0))
      .map(p => p.prodPerSec)
      .reduce((p, c) => p.plus(c), ZERO);

    this.search();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  search(): void {
    if (this.sortName === "prodPerSec") {
      this.data = this.unit.makers
        .filter(m => m.producer.quantity.gt(0))
        .sort((a, b) =>
          this.sortValue === "ascend"
            ? a.prodPerSec.cmp(b.prodPerSec)
            : b.prodPerSec.cmp(a.prodPerSec)
        );
    } else {
      this.data = this.unit.makers
        .filter(m => m.producer.quantity.gt(0))
        .sort((a, b) =>
          this.sortValue === "ascend"
            ? a.producer.name > b.producer.name
              ? 1
              : -1
            : b.producer.name > a.producer.name
            ? 1
            : -1
        );
    }
  }
}
