import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { ShipDesign } from "src/app/model/shipyard/shipDesign";
import { MainService } from "src/app/main.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ONE } from "src/app/model/CONSTANTS";
import { Module } from "src/app/model/shipyard/module";
import { OptionsService } from "src/app/options.service";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { IShipModule } from "src/app/model/shipyard/IShipModule";
import { NzCascaderOption } from "ng-zorro-antd/cascader/typings";
import { trigger } from "@angular/animations";
import { ALL_SIZES, Sizes } from "src/app/model/data/sizes";
declare let numberformat;

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
  animations: [trigger("noop", [])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() design: ShipDesign;
  original: ShipDesign;
  isEqual = true;
  changeEmitter = new EventEmitter();
  loaded = false;
  otherDesigns: Array<ShipDesign>;
  blueprintWarning = false;
  nzOptions: NzCascaderOption[];
  sizes = ALL_SIZES;

  constructor(
    ms: MainService,
    public os: OptionsService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(ms, cd);
    if (this.ms.game.challengeManager.xsChallenge.quantity.gte(1)) {
      this.sizes = ALL_SIZES.concat(Sizes.Titanic);
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaded = true;
      this.animationDisabled = false;
    });
  }
  ngOnInit() {
    this.nzOptions = this.ms.game.shipyardManager.groups.map((group) => {
      return {
        value: group.id,
        label: group.name,
        group,
        children: group.all.map((mod) => {
          return {
            value: mod.id,
            label: mod.name,
            mod,
            isLeaf: true
          };
        })
      };
    });

    this.ms.game.shipyardManager.designerView = true;
    this.ms.game.shipyardManager.postUpdate();
    this.subscriptions.push(
      this.route.paramMap.subscribe((paramMap) =>
        this.getDesign(paramMap.get("id"))
      )
    );
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.ms.game.shipyardManager.designerView = false;
  }
  getDesign(id: string) {
    const idNum = parseInt(id, 10);
    this.original = this.ms.game.shipyardManager.shipDesigns.find(
      (des) => idNum === des.id
    );
    if (this.original) {
      this.design = this.original.getCopy();
      while (this.design.modules.length < 3) {
        this.addLine();
      }
    }
    this.otherDesigns = this.ms.game.shipyardManager.shipDesigns.filter(
      (d) => d !== this.original
    );

    this.cd.markForCheck();
    this.changeEmitter.emit(this.original?.id ?? 100);
  }
  addLine(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.design.modules.push({
      module: null,
      level: 10,
      size: 1,
      levelUi: "1"
    });
    this.reload();
    this.cd.markForCheck();
  }
  removeLine(index: number) {
    this.design.modules.splice(index, 1);
    this.reload();
  }
  moduleChange(index: number) {
    this.design.modules[
      index
    ].module = this.ms.game.shipyardManager.modules.find(
      (m) => m.id === this.design.modules[index].moduleId
    );
    if (this.design.modules[index].module) {
      this.design.modules[index].level = Math.max(
        this.design.modules[index].module.maxLevel - 1,
        10
      );
    }
    this.design.modules[index].levelUi = MainService.formatPipe.transform(
      this.design.modules[index].level,
      true
    );
    this.reload();
  }
  getModId(module: Module) {
    return module.id;
  }
  getSizeId(size: number) {
    return size;
  }
  getGroupId(index: number, group: any) {
    return group.id;
  }
  reload(index: number = -1) {
    if (index > -1) {
      let levelUi = this.design.modules[index].levelUi;
      if (!OptionsService.usaFormat) {
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
            .toNumber()
        : 1;
    }
    if (this.design) {
      this.design.reload(true);
      this.isEqual = true;
      const lines1 = this.design.modules.filter((l) => l.module);
      const lines2 = this.original.modules.filter((l) => l.module);
      if (lines1.length === lines2.length) {
        for (let i = 0, n = lines1.length; i < n; i++) {
          if (
            lines1[i].module !== lines2[i].module ||
            lines1[i].level !== lines2[i].level ||
            lines1[i].size !== lines2[i].size
          ) {
            this.isEqual = false;
          }
        }
      } else this.isEqual = false;

      if (!this.design.available) {
        this.original.fleets.forEach((fl) => {
          if (fl.shipsQuantity > 0) {
            this.blueprintWarning = true;
            this.design.valid = false;
          }
        });
      }

      this.changeEmitter.emit("1");
      this.cd.markForCheck();
    }
  }
  update() {
    if (this.ms.game.shipyardManager.update(this.original, this.design)) {
      this.original = this.design;
      this.design = this.original.getCopy();
      while (this.design.modules.length < 3) {
        this.addLine();
      }
      this.changeEmitter.emit("1");
      this.isEqual = true;
    }
  }
  maximize() {
    this.design.maximize();
    this.design.modules.forEach((mod) => {
      mod.levelUi = MainService.formatPipe.transform(mod.level, true);
      this.reload();
    });
    this.changeEmitter.emit("1");
  }
  isDisabled(): boolean {
    // console.log("v " + this.design.valid + " e " + this.isEqual);
    return !this.design.valid || this.isEqual;
  }
  delete() {
    this.ms.game.shipyardManager.delete(this.original);
    this.router.navigateByUrl("/des/add");
  }
  getIcon(id: string): string {
    const mod = this.ms.game.shipyardManager.modules.find((m) => m.id === id);
    return mod ? mod.shape : "";
  }
  getDesId(index: number, des: ShipDesign) {
    return des.id;
  }
  getLineId(index: number, iShipModule: IShipModule) {
    return "" + index + iShipModule?.moduleId;
  }
  onModuleChanges(values: string[], index: number): void {
    this.design.modules[index].moduleId = values[values.length - 1];
    this.moduleChange(index);
  }
}
