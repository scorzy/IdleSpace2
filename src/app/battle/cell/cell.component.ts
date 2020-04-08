import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Input,
  OnChanges
} from "@angular/core";
import { Cell } from "src/app/model/enemy/cell";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { UNIT_TYPES } from "src/app/model/data/units";
import { Game } from "src/app/model/game";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent implements OnInit, OnDestroy, OnChanges {
  private subscriptions: Subscription[] = [];
  @Input() cell: Cell;
  icons: string[];
  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadIcons();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.loadIcons();
  }
  loadIcons() {
    this.icons = null;
    if (this.cell.materials.length > 0) {
      const rm = Game.getGame().resourceManager;
      this.icons = [];
      for (let i = 0, n = this.cell.materials.length; i < n; i++) {
        if (
          this.cell.materials[i].material.unitData.unitType ===
          UNIT_TYPES.DISTRICT
        ) {
          this.icons.push(this.cell.materials[i].material.icon);
        }
      }
      for (let i = 0, n = this.cell.materials.length; i < n; i++) {
        if (
          this.cell.materials[i].material.unitData.unitType ===
          UNIT_TYPES.MATERIAL
        ) {
          if (
            (this.cell.materials[i].material === rm.metal &&
              this.cell.materials.findIndex(
                (m) => m.material === rm.miningDistrict
              ) < 0) ||
            (this.cell.materials[i].material === rm.energy &&
              this.cell.materials.findIndex(
                (m) => m.material === rm.energyDistrict
              ) < 0) ||
            (this.cell.materials[i].material === rm.science &&
              this.cell.materials.findIndex(
                (m) => m.material === rm.habitableSpace
              ) < 0)
          )
            this.icons.push(this.cell.materials[i].material.icon);
        } else if (
          this.cell.materials[i].material.unitData.unitType !==
          UNIT_TYPES.DISTRICT
        ) {
          this.icons.push(this.cell.materials[i].material.icon);
        }
      }
    }
  }
}
