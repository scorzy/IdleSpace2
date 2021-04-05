import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { Production } from "src/app/model/units/production";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-prod-table",
  templateUrl: "./prod-table.component.html",
  styleUrls: ["./prod-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProdTableComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Unit;
  @Input() col = false;
  @Input() expandable = false;
  genBon = false;
  effBon = false;
  getProdId(index: number, production: Production) {
    return index + production.producer.id + production.product.id;
  }
}
