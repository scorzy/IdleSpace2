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
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Mod } from "src/app/model/units/mod";
import { Production } from "src/app/model/units/production";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ZERO } from "src/app/model/CONSTANTS";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-mod",
  templateUrl: "./mod.component.html",
  styleUrls: ["./mod.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModComponent extends BaseComponentComponent {
  @Input() unit: Unit;
  disabled = false;
  isLarge = true;
  componentTotal = ZERO;
  componentGain = ZERO;
  componentNeed = ZERO;
  componentPercent = 0;

  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.reloadComp();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe((n) => {
        this.reloadComp();
        this.cd.markForCheck();
      }),
      this.route.paramMap.subscribe((paramMap: ParamMap) =>
        this.getUnit(paramMap.get("id"))
      ),
      this.breakpointObserver
        .observe(["(min-width: 899px)"])
        .subscribe((state: BreakpointState) => {
          this.isLarge = state.matches;
          this.cd.markForCheck();
        })
    );
  }
  reloadComp() {
    if (!this.unit) return false;
    this.componentGain = this.unit.quantity.times(this.unit.recycle);
    this.componentTotal = this.ms.game.resourceManager.components.quantity.plus(
      this.componentGain
    );
    this.componentNeed = this.unit.limitTemp
      .minus(1)
      .times(this.unit.componentsTemp);
    this.componentPercent = this.componentTotal
      .div(this.componentNeed)
      .times(100)
      .min(100)
      .floor()
      .toNumber();
  }
  getUnit(id: string) {
    this.unit = this.ms.game.resourceManager.units.find((u) => id === u.id);
    this.unit.modStack.mods.forEach((m) => {
      m.uiQuantity = m.quantity;
      m.uiQuantityString = m.uiQuantity.eq(0)
        ? ""
        : MainService.formatPipe.transform(m.uiQuantity, true);
    });
    this.unit.modStack.mods.forEach((m) => m.reloadBonus());
    this.unit.production.forEach((prod) => {
      prod.reloadMod();
    });
    this.unit.modStack.reload();
    this.cd.markForCheck();
  }
  cancel() {
    this.unit.modStack.mods.forEach((m) => {
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
    const ok = production.prodPerSecFull.lt(production.prodPerSecMod);
    // if (production.ratio.lt(0)) ok = !ok;
    return ok ? "text-success" : "text-danger";
  }
  getClass(current: Decimal, newVal: Decimal, rev: boolean = false) {
    if (current.eq(newVal)) return "";
    let val = current.lt(newVal);
    if (rev) val = !val;
    return val ? "text-success" : "text-danger";
  }
  onModChange(ok: boolean) {
    this.reloadComp();
    if (!ok) {
      this.disabled = true;
    } else {
      this.disabled =
        this.unit.modStack.usedTemp.gt(this.unit.maxMods) ||
        this.unit.modStack.mods.findIndex((m) => !m.uiOk) > -1;
    }
  }
  confirm() {
    if (this.disabled) return false;
    this.unit.confirmMods();
    this.router.navigate(["/units/w"]);
  }
}
