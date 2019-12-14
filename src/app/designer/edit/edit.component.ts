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
  comparisonData: {
    name: string;
    original: Decimal;
    new: Decimal;
    type: string;
  }[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
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
    this.original = this.ms.game.shipyardManager.shipDesigns.find(
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

    this.design.modules.push({ module: null, level: ONE, size: 1 });
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

  reload() {
    if (this.design) {
      this.design.reload();
      this.makeComparisonData();
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
        : this.original.totalArmour.lt(this.design.totalArmour)
        ? "success"
        : ""
    });
  }
}
