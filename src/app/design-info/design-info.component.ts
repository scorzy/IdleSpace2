import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { Subscription } from "rxjs";

@Component({
  selector: "app-design-info",
  templateUrl: "./design-info.component.html",
  styleUrls: ["./design-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignInfoComponent implements OnInit, OnDestroy {
  @Input() original: ShipDesign;
  @Input() design: ShipDesign;
  @Input() size = "middle";
  @Input() updateEmitter: EventEmitter<number>;

  private subscriptions: Subscription[] = [];

  comparisonData: {
    name: string;
    original: Decimal | number;
    new?: Decimal | number;
    type?: string;
    classes?: string;
  }[] = [];
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.updateEmitter) {
      this.subscriptions.push(
        this.updateEmitter.subscribe(() => {
          this.makeComparisonData();
          this.cd.markForCheck();
        })
      );
    }
    this.makeComparisonData();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  makeComparisonData() {
    this.comparisonData = [];
    this.comparisonData.push({
      name: "Armour",
      original: this.original.totalArmour,
      new: !this.design ? null : this.design.totalArmour,
      type: !this.design
        ? null
        : this.original.totalArmour > this.design.totalArmour
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.totalArmour < this.design.totalArmour
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Shield",
      original: this.original.totalShield,
      new: !this.design ? null : this.design.totalShield,
      type: !this.design
        ? null
        : this.original.totalShield > this.design.totalShield
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.totalShield < this.design.totalShield
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Avg. Damage",
      original: this.original.totalDamage,
      new: !this.design ? null : this.design.totalDamage,
      type: !this.design
        ? null
        : this.original.totalDamage > this.design.totalDamage
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.totalDamage < this.design.totalDamage
        ? "text-success"
        : ""
    });

    this.comparisonData.push({
      name: "Price",
      original: this.original.price,
      new: !this.design ? null : this.design.price,
      type: !this.design
        ? null
        : this.original.price.lt(this.design.price)
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.price.gt(this.design.price)
        ? "text-success"
        : ""
    });
  }
}
