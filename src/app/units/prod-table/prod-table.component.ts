import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { Production } from "src/app/model/units/production";

@Component({
  selector: "app-prod-table",
  templateUrl: "./prod-table.component.html",
  styleUrls: ["./prod-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProdTableComponent implements OnInit {
  @Input() unit: Unit;
  constructor() {}

  ngOnInit(): void {}
  getProdId(index: number, production: Production) {
    return index + production.producer.id + production.product.id;
  }
}
