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
    icon?: string;
    iconClass?: string;
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
      icon: "my:metal-scales",
      iconClass: "armour-damage-color",
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
      name: "Armour dmg. Reduction",
      icon: "my:shield-reflect",
      iconClass: "armour-damage-color",
      original: this.original.armourReduction,
      new: !this.design ? null : this.design.armourReduction,
      type: !this.design
        ? null
        : this.original.armourReduction > this.design.armourReduction
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.armourReduction < this.design.armourReduction
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Shield",
      icon: "my:bubble-field",
      iconClass: "shield-damage-color",
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
      name: "Shield dmg. Reduction",
      icon: "my:shield-reflect",
      iconClass: "shield-damage-color",
      original: this.original.shieldReduction,
      new: !this.design ? null : this.design.shieldReduction,
      type: !this.design
        ? null
        : this.original.shieldReduction > this.design.shieldReduction
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.shieldReduction < this.design.shieldReduction
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Avg. Damage",
      icon: "my:blaster",
      iconClass: "damage-color",
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
      name: "Explosion",
      icon: "my:explosion-rays",
      iconClass: "explosion-color",
      original: this.original.explosionThreshold,
      new: !this.design ? null : this.design.explosionThreshold,
      type: !this.design
        ? null
        : this.original.explosionThreshold < this.design.explosionThreshold
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.explosionThreshold > this.design.explosionThreshold
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Explosion dmg.",
      icon: "my:explosion-rays",
      iconClass: "damage-color",
      original: this.original.explosionDamage,
      new: !this.design ? null : this.design.explosionDamage,
      type: !this.design
        ? null
        : this.original.explosionDamage > this.design.explosionDamage
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.explosionDamage < this.design.explosionDamage
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Price",
      icon: "tool",
      iconClass: "damage-color",
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

    this.comparisonData.push({
      name: "Cargo",
      icon: "my:cube",
      iconClass: "cargo-color",
      original: this.original.cargo,
      new: !this.design ? null : this.design.cargo,
      type: !this.design
        ? null
        : this.original.cargo.gt(this.design.cargo)
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.cargo.lt(this.design.cargo)
        ? "text-success"
        : ""
    });
  }
}
