import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef
} from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { FleetShips } from "../model/shipyard/fleetShips";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { FLEET_NUMBER, FLEET_CAPACITY } from "../model/CONSTANTS";
import { trigger } from "@angular/animations";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: "app-shipyard",
  templateUrl: "./shipyard.component.html",
  styleUrls: ["./shipyard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger("noop", [])]
})
export class ShipyardComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  fleetNum = 0;
  warning = false;
  fleetNames = [];
  panels = [
    {
      active: false,
      name: "Fleet 1",
      disabled: false,
      fleet: 0
    }
  ];
  tplModal?: NzModalRef;

  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private modal: NzModalService
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.ms.game.shipyardManager.shipyardPage = true;
    this.ms.game.shipyardManager.reloadFleetCapacity();
    this.fleetNames = ["Fleet 1", "Fleet 2", "Fleet 3", "Fleet 4", "Fleet 5"];
    this.panels = [];
    for (let i = 0; i < 5; i++) {
      this.panels.push({
        active: false,
        name: this.fleetNames[i],
        disabled: false,
        fleet: i
      });
    }
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.ms.game.reloadNavalCapacity();
        this.checkWarning();
        this.cd.markForCheck();
      }),
      this.route.paramMap.subscribe((paramMap) =>
        this.getFleet(paramMap.get("id"))
      )
    );
  }
  checkWarning() {
    this.warning = false;
    this.ms.game.shipyardManager.shipDesigns.forEach((des) => {
      des.fleets.forEach((fl) => {
        if (fl.wantedShipsUi < fl.wantedShips) this.warning = true;
      });
    });
  }
  ngOnDestroy() {
    this.ms.game.shipyardManager.shipyardPage = false;
    super.ngOnDestroy();
  }
  getFleet(id: string): void {
    this.fleetNum = parseInt(id, 10);
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.shipyardManager.toDo,
      event.previousIndex,
      event.currentIndex
    );
  }
  getDesignId(index: number, design: ShipDesign) {
    return design.id + (design.available ? "A" : "");
  }
  getNameId(index: number, name: string) {
    return index + name;
  }
  getFleetId(index: number, fleet: FleetShips) {
    return index;
  }
  getPanelId(index: number, panels: any) {
    return index;
  }
  confirm() {
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.ms.game.shipyardManager.fleetNavCapPriority[i] = Math.min(
        FLEET_CAPACITY,
        Math.max(this.ms.game.shipyardManager.fleetNavCapPriorityUi[i], 0)
      );
    }
    this.ms.game.shipyardManager.shipDesigns.forEach((des) => {
      des.fleets.forEach((fl) => {
        fl.navalCapPercent = fl.navalCapPercentUi;
      });
    });
  }
  reinforceAll() {
    this.ms.game.shipyardManager.reinforceAll();
  }
  reinforce(i: number) {
    this.ms.game.shipyardManager.reinforce(i);
  }
  getTooltip(design: ShipDesign): string {
    let ret = "";
    if (!design.available) {
      ret = "This is a blueprint. Not available yet.";
    } else if (design.next && design.next.available) {
      ret =
        "This design is obsolete. " + design.next.name + " is used instead.";
    }
    return ret;
  }
  copyOne() {
    this.ms.game.shipyardManager.shipDesigns.forEach((des) => {
      for (let i = 1; i < FLEET_NUMBER; i++) {
        des.fleets[i].navalCapPercentUi = des.fleets[0].navalCapPercentUi;
      }
    });
  }
  setFleets(index: number) {
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.ms.game.shipyardManager.fleetNavCapPriorityUi[i] =
        index >= i ? 1 : 0;
    }
  }
  view(design: ShipDesign, tplContent: TemplateRef<{}>): void {
    this.tplModal = this.modal.create({
      nzTitle: design.name,
      nzContent: tplContent,
      nzClosable: true,
      nzComponentParams: {
        value: design
      },
      nzFooter: null
    });
  }
}
