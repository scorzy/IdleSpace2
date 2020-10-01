import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Mod } from "src/app/model/units/mod";
import { Production } from "src/app/model/units/production";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ZERO, ONE } from "src/app/model/CONSTANTS";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Technology } from "src/app/model/researches/technology";
import { Worker } from "src/app/model/units/worker";
import { Research } from "src/app/model/researches/research";
import { OptionsService } from "src/app/options.service";
import { NzMessageService } from "ng-zorro-antd/message";
@Component({
  selector: "app-mod",
  templateUrl: "./mod.component.html",
  styleUrls: ["./mod.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Worker;
  disabled = false;
  isLarge = true;
  droneRestart = ONE;
  componentTotal = ZERO;
  componentGain = ZERO;
  componentNeed = ZERO;
  componentPercent = 0;
  modRequired = new Array<Decimal>();
  modRequiredTemp = new Array<Decimal>();

  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    public os: OptionsService,
    private message: NzMessageService
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.modRequired = [ZERO, ZERO, ZERO, ZERO, ZERO];
    this.modRequiredTemp = [ZERO, ZERO, ZERO, ZERO, ZERO];
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
    let recycle = this.unit.recycle.plus(this.ms.game.baseRecycling);
    recycle = recycle.min(this.unit.components.times(0.9));
    this.componentGain = this.unit.quantity.times(recycle);
    this.droneRestart = this.componentGain
      .div(this.unit.componentsTemp)
      .plus(1)
      .floor();
    this.droneRestart = this.droneRestart.min(this.unit.limitTemp.minus(ONE));
    this.componentGain = this.componentGain
      .minus(this.droneRestart.times(this.unit.componentsTemp))
      .max(0);
    this.componentTotal = this.ms.game.resourceManager.components.quantity.plus(
      this.componentGain
    );

    this.componentNeed = this.unit.limitTemp
      .minus(this.droneRestart)
      .times(this.unit.componentsTemp);
    this.componentPercent = this.componentTotal
      .div(this.componentNeed)
      .times(100)
      .min(100)
      .floor()
      .toNumber();
  }
  getUnit(id: string) {
    this.unit = this.ms.game.resourceManager.workers.find((u) => id === u.id);
    this.unit.modPage = true;
    this.unit.modStack.mods.forEach((m) => {
      m.uiQuantity = m.quantity;
      m.uiQuantityString = m.uiQuantity.eq(0)
        ? "0"
        : MainService.formatPipe.transform(m.uiQuantity, true);
      m.priorityUi = m.priority;
    });
    this.unit.modStack.mods.forEach((m) => m.reloadBonus());
    this.unit.production.forEach((prod) => {
      prod.reloadMod();
    });
    this.unit.modStack.reload();
    this.cd.markForCheck();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.unit.modPage = false;
  }
  cancel() {
    this.unit.modStack.mods.forEach((m) => {
      m.uiQuantity = m.quantity;
      m.uiQuantityString = MainService.formatPipe.transform(m.uiQuantity, true);
    });
    this.message.info("Mods restored.");
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

    this.router.navigate(
      this.os.listUi ? ["/unitList/unitDetail/" + this.unit.id] : ["/units/w"]
    );
  }
  savePriorities() {
    this.unit.modStack.mods.forEach((mod) => {
      mod.priority = mod.priorityUi;
    });
    this.message.success("Priorities saved.");
  }
  resetPriorities() {
    this.unit.modStack.mods.forEach((mod) => {
      mod.priorityUi = mod.priority;
    });
    this.message.info("Priorities restored.");
  }
  getModRes(): Research[] {
    return this.unit.modsResearches.filter((res) => res.quantity.gt(0));
  }
  getResId(index: number, res: Research) {
    return res.id;
  }
  getResMod(res: Research): number {
    return res.modPoints.find((m) => m.unit === this.unit).multi;
  }
  getTechId(index: number, tech: Technology) {
    return tech.id;
  }
}
