import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-design-info",
  templateUrl: "./design-info.component.html",
  styleUrls: ["./design-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignInfoComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() original: ShipDesign;
  @Input() design: ShipDesign;
  @Input() size = "middle";
  @Input() updateEmitter: EventEmitter<number>;
  comparisonData: {
    name: string;
    original: Decimal | number;
    new?: Decimal | number;
    type?: string;
    classes?: string;
    icon?: string;
    iconClass?: string;
  }[] = [];

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
      name: "Armour dmg. red.",
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
      name: "Shield dmg. red.",
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
      name: "Shield Recharge",
      icon: "my:armor-upgrade",
      iconClass: "shield-damage-color",
      original: this.original.shieldRecharge,
      new: !this.design ? null : this.design.shieldRecharge,
      type: !this.design
        ? null
        : this.original.shieldRecharge > this.design.shieldRecharge
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.shieldRecharge < this.design.shieldRecharge
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
    this.comparisonData.push({
      name: "Science",
      icon: "fa-s:flask",
      iconClass: "science-color",
      original: this.original.scienceLab,
      new: !this.design ? null : this.design.scienceLab,
      type: !this.design
        ? null
        : this.original.scienceLab.gt(this.design.scienceLab)
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.scienceLab.lt(this.design.scienceLab)
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Velocity",
      icon: "my:rocket-thruster",
      iconClass: "velocity-color",
      original: this.original.velocity,
      new: !this.design ? null : this.design.velocity,
      type: !this.design
        ? null
        : this.original.velocity < this.design.velocity
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.velocity > this.design.velocity
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Acceleration",
      icon: "forward",
      iconClass: "acceleration-color",
      original: this.original.acceleration,
      new: !this.design ? null : this.design.acceleration,
      type: !this.design
        ? null
        : this.original.acceleration < this.design.acceleration
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.acceleration > this.design.acceleration
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Threat",
      icon: "my:archery-target",
      iconClass: "threat-color",
      original: this.original.threat,
      new: !this.design ? null : this.design.threat,
      type: !this.design
        ? null
        : this.original.threat > this.design.threat
        ? "danger"
        : "",
      classes: !this.design
        ? null
        : this.original.threat < this.design.threat
        ? "text-success"
        : ""
    });
  }
}
