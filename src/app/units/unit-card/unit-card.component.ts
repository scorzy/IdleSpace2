import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  TemplateRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { Worker } from "src/app/model/units/worker";
import { ONE } from "src/app/model/CONSTANTS";
import { Production } from "src/app/model/units/production";
import { Price } from "src/app/model/prices/price";
import { NzModalService, NzModalRef } from "ng-zorro-antd/modal";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Bonus } from "src/app/model/bonus/bonus";
import { Building } from "src/app/model/units/building";

@Component({
  selector: "app-unit-card",
  templateUrl: "./unit-card.component.html",
  styleUrls: ["./unit-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitCardComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Worker;
  building: Building;
  tplModal: NzModalRef;
  popoverTrigger: string = null;
  actions = [];
  sliderDisabled = false;
  index1 = 0;
  isVisible = false;
  Decimal = Decimal;
  ONE = ONE;
  customBuy = ONE;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private modalService: NzModalService,
    public breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.popoverTrigger = "hover";
    if (this.unit instanceof Building && this.unit.departments) {
      this.building = this.unit;
    }
    this.sliderDisabled = !this.unit.production.find((p) => p.ratio.lt(0));
    // this.getActions();
    this.unit.reloadMaxBuy();
    this.reloadCustomBuy();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        // this.getActions();
        this.unit.reloadMaxBuy();
        this.reloadCustomBuy();
        this.cd.markForCheck();
      }),
      this.breakpointObserver
        .observe(["(min-width: 959px)"])
        .subscribe((state: BreakpointState) => {
          this.popoverTrigger = state.matches ? "hover" : "null";
        })
    );
  }
  buyOneAct() {
    this.unit.buy(ONE);
  }
  buyCustom() {
    this.unit.buy(this.customBuy);
  }
  getProdId(index: number, production: Production) {
    return index + production.producer.id + production.product.id;
  }
  getPriceId(index: number, pri: Price) {
    return index + pri.spendable.id;
  }
  createModal(tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.tplModal = this.modalService.create({
      nzTitle: this.unit.name,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true
    });
  }
  destroyTplModal() {
    this.tplModal.destroy();
  }
  goModPage() {
    this.router.navigate(["/mod/" + this.unit.id]);
  }
  goDepPage() {
    this.router.navigate(["/dep/" + this.unit.id]);
  }
  getBonusId(index: number, bonus: Bonus) {
    return bonus.unit.id;
  }
  reloadCustomBuy() {
    if (this.ms.game.buyFixed) {
      this.customBuy = this.ms.game.customBuy;
    } else {
      this.customBuy = this.unit.buyPrice.maxBuy
        .times(this.ms.game.customBuyPercent)
        .floor()
        .max(1);
    }
  }
}
