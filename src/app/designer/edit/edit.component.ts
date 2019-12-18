import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { ShipDesign } from "src/app/model/shipyard/shipDesign";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ONE } from "src/app/model/CONSTANTS";
import { Module } from "src/app/model/shipyard/module";
import { fadeIn } from "src/app/animations";
import { OptionsService } from "src/app/options.service";
declare let numberformat, Parser;

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
  animations: [fadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() design: ShipDesign;
  original: ShipDesign;
  isEqual = true;
  comparisonData: {
    name: string;
    original: Decimal;
    new: Decimal;
    type: string;
    classes: string;
  }[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    public os: OptionsService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      // this.ms.updateEmitter.subscribe(() => {
      //   this.cd.markForCheck();
      // }),
      this.route.paramMap.subscribe(paramMap =>
        this.getDesign(paramMap.get("id"))
      )
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getDesign(id: string) {
    this.original = this.ms.game.shipyardManager.updatedShipDesigns.find(
      des => parseInt(id) === des.id
    );
    if (this.original) {
      this.design = this.original.getCopy();
      while (this.design.modules.length < 3) {
        this.addLine();
      }
      this.makeComparisonData();
    }
    this.cd.markForCheck();
  }

  addLine(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.design.modules.push({
      module: null,
      level: ONE,
      size: 1,
      levelUi: "1"
    });
  }
  removeLine(index: number) {
    this.design.modules.splice(index, 1);
    this.reload();
  }
  moduleChange(index: number) {
    this.design.modules[
      index
    ].module = this.ms.game.shipyardManager.modules.find(
      m => m.id === this.design.modules[index].moduleId
    );
    this.reload();
  }
  getModId(module: Module) {
    return module.id;
  }
  getSizeId(size: number) {
    return size;
  }
  getGroupId(index: number) {
    return index;
  }

  reload(index: number = -1) {
    if (index > -1) {
      let levelUi = this.design.modules[index].levelUi;
      if (!this.os.usaFormat) {
        levelUi = levelUi.replace(",", "###");
        levelUi = levelUi.replace(".", "@@@");
        levelUi = levelUi.replace("###", ".");
        levelUi = levelUi.replace("@@@", ",");
      }
      this.design.modules[index].level = levelUi
        ? numberformat
            .parse(levelUi, {
              backend: "decimal.js",
              Decimal
            })
            .max(ONE)
        : ONE;
    }
    if (this.design) {
      this.design.reload(true);
      this.isEqual = true;
      const lines1 = this.design.modules.filter(l => l.module);
      const lines2 = this.original.modules.filter(l => l.module);
      if (lines1.length === lines2.length)
        for (let i = 0, n = lines1.length; i < n; i++) {
          if (
            lines1[i].module !== lines2[i].module ||
            lines1[i].level !== lines2[i].level ||
            lines1[i].size !== lines2[i].size
          )
            this.isEqual = false;
        }
      else this.isEqual = false;

      this.makeComparisonData();
      this.cd.markForCheck();
    }
  }
  makeComparisonData() {
    this.comparisonData = [];
    this.comparisonData.push({
      name: "Armour",
      original: this.original.totalArmour,
      new: this.design.totalArmour,
      type: this.original.totalArmour.gt(this.design.totalArmour)
        ? "danger"
        : "",
      classes: this.original.totalArmour.lt(this.design.totalArmour)
        ? "text-success"
        : ""
    });
    this.comparisonData.push({
      name: "Shield",
      original: this.original.totalShield,
      new: this.design.totalShield,
      type: this.original.totalShield.gt(this.design.totalShield)
        ? "danger"
        : "",
      classes: this.original.totalShield.lt(this.design.totalShield)
        ? "tex-success"
        : ""
    });
    this.comparisonData.push({
      name: "Avg. Damage",
      original: this.original.totalDamage,
      new: this.design.totalDamage,
      type: this.original.totalDamage.gt(this.design.totalDamage)
        ? "danger"
        : "",
      classes: this.original.totalDamage.lt(this.design.totalDamage)
        ? "tex-success"
        : ""
    });

    this.comparisonData.push({
      name: "Price",
      original: this.original.price,
      new: this.design.price,
      type: this.original.price.lt(this.design.price) ? "danger" : "",
      classes: this.original.price.gt(this.design.price) ? "tex-success" : ""
    });
  }
  update() {
    if (this.ms.game.shipyardManager.update(this.original, this.design)) {
      this.original = this.design;
      this.design = this.original.getCopy();
      while (this.design.modules.length < 3) {
        this.addLine();
      }
    }
  }
  isDisabled(): boolean {
    return !this.design.valid || this.isEqual;
  }
}
