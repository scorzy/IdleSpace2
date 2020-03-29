import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { Unit } from "src/app/model/units/unit";
import { MainService } from "src/app/main.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Mod } from "src/app/model/units/mod";
import { Production } from "src/app/model/units/production";

@Component({
  selector: "app-mod",
  templateUrl: "./mod.component.html",
  styleUrls: ["./mod.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModComponent implements OnInit, OnDestroy {
  @Input() unit: Unit;
  private subscriptions: Subscription[] = [];
  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe((paramMap: ParamMap) =>
        this.getUnit(paramMap.get("id"))
      )
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getUnit(id: string) {
    this.unit = this.ms.game.resourceManager.units.find(u => id === u.id);
    this.unit.modStack.mods.forEach(m => {
      m.uiQuantity = m.quantity;
      m.uiQuantityString = m.uiQuantity.eq(0)
        ? ""
        : MainService.formatPipe.transform(m.uiQuantity, true);
    });
    this.unit.modStack.mods.forEach(m => m.reloadBonus());
    this.unit.production.forEach(prod => {
      prod.reloadMod();
    });
    this.cd.markForCheck();
  }
  cancel() {
    this.unit.modStack.mods.forEach(m => {
      m.uiQuantity = m.quantity;
      m.uiQuantityString = MainService.formatPipe.transform(m.uiQuantity, true);
    });
    this.cd.markForCheck();
  }
  getModId(index: number, mod: Mod) {
    return index + (this.unit ? this.unit.id : "");
  }
  getProdClass(production: Production): string {
    if (production.prodPerSecFull.eq(production.prodPerSecMod)) return "";
    let ok = production.prodPerSecFull.lt(production.prodPerSecMod);
    // if (production.ratio.lt(0)) ok = !ok;
    return ok ? "text-success" : "text-danger";
  }
  getClass(current: Decimal, newVal: Decimal, rev: boolean = false) {
    if (current.eq(newVal)) return "";
    let val = current.lt(newVal);
    if (rev) val = !val;
    return val ? "text-success" : "text-danger";
  }
}
