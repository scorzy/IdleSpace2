import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Mod } from "src/app/model/units/mod";
import { parseDecimal } from "src/app/model/utility/parseDecimal";
import { MainService } from "src/app/main.service";
import { Unit } from "src/app/model/units/unit";
import { Subscription } from "rxjs";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ZERO } from "src/app/model/CONSTANTS";

@Component({
  selector: "app-mod-line",
  templateUrl: "./mod-line.component.html",
  styleUrls: ["./mod-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModLineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mod: Mod;
  @Input() uiQuantityString: string;
  @Input() unit: Unit;
  @Output() modChange = new EventEmitter<boolean>();
  status = "";
  isLarge = true;
  realMin = ZERO;
  realMax = ZERO;

  private subscriptions: Subscription[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    public breakpointObserver: BreakpointObserver
  ) {}
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
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
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
    const ok =
      this.mod.uiQuantity.lte(this.realMax) &&
      this.mod.uiQuantity.gte(this.realMin);

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
    );
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
}
