import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  SimpleChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  OnChanges
} from "@angular/core";
import { Mod } from "src/app/model/units/mod";
import { parseDecimal } from "src/app/model/utility/parseDecimal";
import { MainService } from "src/app/main.service";
import { Worker } from "src/app/model/units/worker";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ZERO, MAX_MOD_PRESET } from "src/app/model/CONSTANTS";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-mod-line",
  templateUrl: "./mod-line.component.html",
  styleUrls: ["./mod-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModLineComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() mod: Mod;
  @Input() uiQuantityString: string;
  @Input() uiPreset0: string;
  @Input() uiPreset1: string;
  @Input() uiPreset2: string;
  @Input() uiPreset3: string;
  @Input() uiPreset4: string;
  @Input() unit: Worker;
  @Output() modChange = new EventEmitter<boolean>();
  status = "";
  isLarge = true;
  realMin = ZERO;
  realMax = ZERO;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public breakpointObserver: BreakpointObserver
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.subscriptions.push(
      this.breakpointObserver
        .observe(["(min-width: 899px)"])
        .subscribe((state: BreakpointState) => {
          this.isLarge = state.matches;
          this.cd.markForCheck();
        })
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reload(true);
  }
  valueChange(): void {
    this.mod.uiQuantity = parseDecimal(this.mod.uiQuantityString);
    this.mod.reloadBonus();
    this.reload();
  }
  reload(noEmit = false) {
    this.unit.reloadAll();
    this.realMax = this.mod.max.min(this.unit.maxMods);
    this.realMin = this.mod.min.max(this.unit.maxMods.times(-1));
    let ok =
      this.mod.uiQuantity.lte(this.realMax) &&
      this.mod.uiQuantity.gte(this.realMin);

    for (let i = 0; i < MAX_MOD_PRESET; i++) {
      if (this.mod.uiPresets[i].lt(this.mod.min)) ok = false;
      if (this.mod.uiPresets[i].gt(this.mod.max)) ok = false;
    }

    this.status = ok ? "" : "error";
    this.mod.uiOk = ok;
    if (!noEmit) this.modChange.emit(ok);
  }
  reformat() {
    this.mod.uiQuantityString = MainService.formatPipe.transform(
      this.mod.uiQuantity,
      true
    );
  }
  plus(num = 1) {
    this.mod.uiQuantity = this.mod.uiQuantity
      .plus(num)
      .max(this.realMin)
      .min(this.realMax)
      .min(
        this.unit.maxMods
          .plus(this.mod.uiQuantity)
          .minus(this.unit.modStack.usedTemp)
      );
    this.mod.uiQuantityString = MainService.formatPipe.transform(
      this.mod.uiQuantity,
      true
    );
    this.reload();
    this.cd.markForCheck();
  }
  max() {
    this.mod.uiQuantity = Decimal.min(
      this.mod.max,
      this.unit.maxMods
        .plus(this.mod.uiQuantity)
        .minus(this.unit.modStack.usedTemp)
    ).min(this.unit.maxMods);
    this.mod.uiQuantityString = MainService.formatPipe.transform(
      this.mod.uiQuantity,
      true
    );
    this.reload();
    this.cd.markForCheck();
  }
  min() {
    this.mod.uiQuantity = this.mod.min.max(this.unit.maxMods.times(-1));
    this.mod.uiQuantityString = MainService.formatPipe.transform(
      this.mod.uiQuantity,
      true
    );
    this.reload();
    this.cd.markForCheck();
  }
  presetChange(index: number) {
    this.mod.uiPresets[index] = parseDecimal(
      this.mod.uiPresetString[index] || "0"
    );
    this.reload();
  }
}
