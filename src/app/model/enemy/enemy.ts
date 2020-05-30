import {
  Cell,
  TO_DO_COLOR,
  DONE_COLOR,
  TO_DO_COLOR_DARK,
  DONE_COLOR_DARK
} from "./cell";
import { ShipDesign } from "../shipyard/shipDesign";
import { SearchJob } from "./searchJob";
import { IShipData, FIRST_DRONE } from "../data/shipsData";
import { Game } from "../game";
import sample from "lodash-es/sample";
import shuffle from "lodash-es/shuffle";
import {
  ENEMY_NAVAL_CAP_LEVEL,
  FLEET_CAPACITY,
  BASE_NAVAL_CAPACITY,
  MOD_LEVEL_EXP,
  TEN,
  DEFENCE_START_LEVEL,
  DEFENCE_FINAL_LEVEL,
  DEFENCE_MAX_PERCENT,
  PRICE_GROW_RATE,
  DEFAULT_MODULE_PRICE,
  ENEMY_BASE_DISTANCE
} from "../CONSTANTS";
import { ShipType } from "../shipyard/ShipType";
import { Module } from "../shipyard/module";
import { OptionsService } from "src/app/options.service";
import { Unit } from "../units/unit";
import { SearchRange } from "./searchOption";
import { UNIT_TYPES } from "../data/units";
import { enemyNames } from "../data/enemyNames";
import { enemySuffixes } from "../data/enemySuffixes";
import icons from "../data/icons.json";

export class ExtraTile {
  number = 0;
  constructor(public unit: Unit) {}
}
export class Enemy {
  static lastId = 0;
  id = 0;
  level = 0;
  name = "";
  icon = "setting";
  cells: Array<Cell>;
  designs: Array<ShipDesign>;
  totalNavCap = 0;
  tiles: Array<ExtraTile> = [];
  distance = ENEMY_BASE_DISTANCE;
  totalStrength = 1;
  private favouriteWeapons: Module[];
  private favouriteDefences: Module[];
  private basicDefences: Module[];
  private modLevel = 1;
  private weaponDefenceRatio = 0;
  private maxGenerator = 1;
  private preferHighLevGen = true;
  constructor() {
    this.id = Enemy.lastId++;
  }
  static getDistance(
    level: number,
    extra: number
  ): { min: Decimal; max: Decimal } {
    const range = Game.getGame().enemyManager.distanceOpt.getRange(extra);
    let minMulti = range.min;
    let maxMulti = range.max;
    if (extra < 0) {
      minMulti = 1 + (range.max - 1) * 0.03;
      maxMulti = 1 + (range.min - 1) * 0.02;
      minMulti = Math.abs(1 / minMulti);
      maxMulti = Math.abs(1 / maxMulti);
    }
    return {
      min: ENEMY_BASE_DISTANCE.times(level + 1).times(minMulti),
      max: ENEMY_BASE_DISTANCE.times(level + 1).times(maxMulti)
    };
  }
  generate(searchJob: SearchJob) {
    const rs = Game.getGame().resourceManager;
    const em = Game.getGame().enemyManager;
    this.generateName();
    this.designs = [];
    let sum = 0;
    this.level = searchJob.enemyLevel;
    const distanceRange = Enemy.getDistance(this.level, searchJob.distanceOpt);
    this.distance = distanceRange.min.plus(
      distanceRange.max.minus(distanceRange.min).times(Math.random())
    );
    //#region Tiles
    const habRange = em.habitabilityOpt.getRange(searchJob.habitabilityOpt);
    const metalRange = em.metalOpt.getRange(searchJob.metalOpt);
    const energyRange = em.energyOpt.getRange(searchJob.energyOpt);
    const scienceRange = em.scienceOpt.getRange(searchJob.scienceOpt);
    const componentRange = em.componentOpt.getRange(searchJob.componentOpt);
    const tileArr: {
      tile: ExtraTile;
      range: SearchRange;
    }[] = [
      {
        tile: new ExtraTile(rs.habitableSpace),
        range: habRange
      },
      {
        tile: new ExtraTile(rs.miningDistrict),
        range: metalRange
      },
      {
        tile: new ExtraTile(rs.energyDistrict),
        range: energyRange
      },
      {
        tile: new ExtraTile(rs.science),
        range: scienceRange
      },
      {
        tile: new ExtraTile(rs.components),
        range: componentRange
      }
    ];
    tileArr.forEach((elem) => {
      elem.tile.number = Math.floor(
        elem.range.min + (elem.range.max - elem.range.min) * Math.random()
      );
      if (elem.tile.number > 0) {
        this.tiles.push(elem.tile);
      }
    });
    //#endregion
    //#region Naval
    const powerRange = em.difficultyOpt.getRange(searchJob.difficultyOpt);
    const powerMulti =
      1 + powerRange.min + (powerRange.max - powerRange.min) * Math.random();
    const navalCapMulti = 1 + Math.floor(powerMulti * 2 * Math.random()) / 10;
    const modLevelMulti = Math.floor((10 * powerMulti) / navalCapMulti) / 10;
    const maxNavalCap =
      navalCapMulti *
      Math.min(
        BASE_NAVAL_CAPACITY / 3 + ENEMY_NAVAL_CAP_LEVEL * this.level,
        FLEET_CAPACITY
      );
    let defPercent = 0;
    if (searchJob.enemyLevel < 1) {
      this.modLevel = 10 * modLevelMulti;
      this.designs.push(this.generateDesign(FIRST_DRONE, this.modLevel));
      sum = 1;
    } else {
      //#region Ships
      this.modLevel =
        Math.floor(100 * Math.pow(MOD_LEVEL_EXP, this.level) * modLevelMulti) /
        10;
      this.weaponDefenceRatio = 0.2 + Math.random() * 0.5;
      const sm = Game.getGame().shipyardManager;
      const maxShip = Math.floor(
        1 + (11 * this.level) / (25 + Math.random() * 20 + this.level)
      );
      let designNum = 1 + Math.random() * (Math.min(this.level, 100) / 20);
      defPercent =
        this.level <= DEFENCE_START_LEVEL
          ? 0
          : Math.max(
              0.05,
              Math.min(
                DEFENCE_MAX_PERCENT,
                (DEFENCE_MAX_PERCENT * (this.level - DEFENCE_START_LEVEL)) /
                  DEFENCE_FINAL_LEVEL
              )
            );
      let defNum = 0;
      if (defPercent > 0) {
        defNum =
          1 +
          Math.floor(
            Math.random() * Math.min(4, (this.level - DEFENCE_START_LEVEL) / 10)
          );
        designNum += 1 - defNum;
        designNum = Math.max(1, designNum);
      }
      //#region Generators
      const maxGen = Math.min(
        Math.floor((6 * this.level) / (35 + Math.random() * 20 + this.level)),
        sm.allGenerators.length - 1
      );
      this.maxGenerator = sm.allGenerators[maxGen].energy;
      this.favouriteDefences = shuffle(
        sm.allDefences.filter(
          (d) => d.armourDamageReduction > 0 || d.shieldDamageReduction
        )
      ).slice(0, 2);
      this.preferHighLevGen = Math.random() > 0.5;
      //#endregion
      //#region Defences
      this.basicDefences = [sm.armour, sm.shield];
      const rnd = Math.random();
      if (rnd > 0.68) {
        this.basicDefences.push(sm.armour);
      } else if (rnd < 0.32) {
        this.basicDefences.push(sm.shield);
      }
      //#endregion
      //#region Weapons
      const allowedShipTypes = sm.shipTypes.slice(0, maxShip);
      this.favouriteWeapons = [];
      const maxWeapons = Math.floor(1 + Math.random() * 4);
      const zeroPercentWeapons = this.level > 10 && maxWeapons > 3;
      const allowedWeapons = sm.allWeapons.filter(
        (w) =>
          zeroPercentWeapons ||
          (w.armourDamagePercent > 0 && w.shieldDamagePercent > 0)
      );
      for (let i = 0; i < maxWeapons; i++) {
        this.favouriteWeapons.push(sample(allowedWeapons));
      }
      let favouriteWeapon = this.favouriteWeapons.find(
        (w) => w.armourDamagePercent > 0 && w.shieldDamagePercent > 0
      );
      if (!favouriteWeapon) {
        favouriteWeapon = sm.weapons.find(
          (w) => w.armourDamagePercent > 0 && w.shieldDamagePercent > 0
        );
        this.favouriteWeapons.push(favouriteWeapon);
      }
      this.favouriteWeapons.push(favouriteWeapon);
      //#endregion
      sum = 0;
      for (let i = 0; i < designNum; i++) {
        let type = sample(allowedShipTypes);
        if (this.designs.findIndex((d) => d.type.id === type.id)) {
          type = sample(allowedShipTypes);
        }
        const des = this.generateRandomDesign(type);
        this.designs.push(des);
        des.enemyPriority = 2 + Math.floor(Math.random() * 3);
        sum += des.enemyPriority;
      }
      if (defPercent > 0) {
        for (let k = 0; k < defNum; k++) {
          const type = sample(allowedShipTypes);
          const des = this.generateRandomDesign(type, true);
          this.designs.push(des);
          des.enemyPriority = 2 + Math.floor(Math.random() * 3);
          sum += des.enemyPriority;
        }
      }
      //#endregion
    }
    this.designs.forEach((des) => {
      const navCap =
        maxNavalCap * (des.isDefence ? defPercent : 1 - defPercent);
      des.enemyQuantity = Math.floor(
        (navCap * des.enemyPriority) / sum / des.type.navalCapacity
      );
    });

    for (let i = 0, n = this.designs.length; i < n; i++) {
      this.designs[i].id = i;
    }
    this.reloadTotalNavalCap();
    //#endregion
  }
  generateCells() {
    const em = Game.getGame().enemyManager;
    const rs = Game.getGame().resourceManager;
    em.districtMultiplier.reloadBonus();
    em.resourceMultiplier.reloadBonus();
    em.scienceMultiplier.reloadBonus();
    rs.units.forEach((u) => {
      if (u.battleGainMulti) {
        u.battleGainMulti.reloadBonus();
      }
    });

    const districtQuantity = TEN.plus(this.level - 1).times(
      em.districtMultiplier.totalBonus
    );
    const materialQuantity = Decimal.pow(1 + this.level, PRICE_GROW_RATE)
      .times(DEFAULT_MODULE_PRICE)
      .times(50)
      .times(em.resourceMultiplier.totalBonus);

    this.cells = new Array<Cell>(100);
    for (let i = 0; i < 10; i++) {
      const cellRow = new Array<Cell>();
      for (let k = 0; k < 10; k++) {
        const cell = new Cell();
        cellRow.push(cell);
        cell.ships = this.designs.map((des) => des.enemyQuantity);
      }
      for (let k = 0; k < 10; k++) {
        cellRow[k].index = i * 10 + k;
        this.cells[cellRow[k].index] = cellRow[k];
      }
    }

    let rowCell: Cell[] = [];
    let row = 0;
    this.tiles.forEach((tile) => {
      for (let i = 0; i < tile.number; i++) {
        rowCell = [];
        rowCell = this.cells.filter(
          (c) => c.index >= row * 10 && c.index < (1 + row) * 10
        );
        let min = Number.POSITIVE_INFINITY;
        rowCell.forEach((c) => {
          min = Math.min(c.materials.length, min);
        });
        rowCell = rowCell.filter((c) => c.materials.length <= min);
        row = (row + 1) % 10;
        // const cell = sample(rowCell.length > 0 ? rowCell : this.cells);
        const cell = sample(rowCell);
        const num =
          tile.unit.unitData.unitType === UNIT_TYPES.DISTRICT
            ? districtQuantity
            : materialQuantity;
        cell.addMaterial(tile.unit, num);
        switch (tile.unit) {
          case rs.miningDistrict:
            cell.addMaterial(rs.metal, materialQuantity);
            break;
          case rs.energyDistrict:
            cell.addMaterial(rs.energy, materialQuantity);
            break;
          case rs.habitableSpace:
            cell.addMaterial(rs.science, materialQuantity);
            break;
        }
      }
    });
  }
  reloadCell(index: number) {
    if (!this.cells) {
      return;
    }
    //#region Color
    let toDoColor: number[];
    let doneColor: number[];
    if (OptionsService.isDark) {
      toDoColor = TO_DO_COLOR_DARK;
      doneColor = DONE_COLOR_DARK;
    } else {
      toDoColor = TO_DO_COLOR;
      doneColor = DONE_COLOR;
    }
    if (this.cells[index].done) {
      this.cells[index].percent = 0;
      this.cells[index].color =
        "rgb(" + doneColor[0] + ", " + doneColor[1] + ", " + doneColor[2] + ")";
    } else {
      let cellNavCap = 0;
      for (let i = 0, n = this.designs.length; i < n; i++) {
        cellNavCap +=
          this.cells[index].ships[i] * this.designs[i].type.navalCapacity;
      }
      this.cells[index].percent = cellNavCap / this.totalNavCap;

      this.cells[index].color = "rgb(";
      for (let i = 0; i < 3; i++) {
        const col =
          toDoColor[i] +
          (doneColor[i] - toDoColor[i]) * (1 - this.cells[index].percent);
        this.cells[index].color += col + (i < 2 ? "," : "");
      }
      this.cells[index].color += ")";
    }
    //#endregion
    //#region Strength
    let sum = 0;
    for (let i = 0, n = this.cells[index].ships.length; i < n; i++) {
      sum += this.cells[index].ships[i] * this.designs[i].type.navalCapacity;
    }
    this.cells[index].enemyStrength =
      this.totalStrength > 0 ? sum / this.totalStrength : 0;
    // endregion
  }
  private generateDesign(iShipData: IShipData, level: number): ShipDesign {
    const sm = Game.getGame().shipyardManager;

    const design = new ShipDesign();
    design.name = "Drone";
    design.type = sm.shipTypes.find((t) => t.id === iShipData.typeId);
    iShipData.modules.forEach((mod) => {
      const modId =
        typeof mod.moduleID === "string" ? mod.moduleID : sample(mod.moduleID);
      const module = sm.modules.find((m) => m.id === modId);
      design.modules.push({
        module,
        level,
        size: mod.size
      });
    });
    design.reload();
    return design;
  }
  private reloadTotalNavalCap() {
    this.totalNavCap = 0;
    this.totalStrength = 0;
    for (let i = 0, n = this.designs.length; i < n; i++) {
      this.totalNavCap +=
        this.designs[i].enemyQuantity * this.designs[i].type.navalCapacity;
      this.totalStrength +=
        this.designs[i].type.navalCapacity * this.designs[i].enemyQuantity;
    }
  }
  private generateRandomDesign(type: ShipType, isDefence = false): ShipDesign {
    const sm = Game.getGame().shipyardManager;

    const design = new ShipDesign();
    design.name = (isDefence ? "def" : "") + type.name;
    design.type = type;
    design.isDefence = isDefence;
    let usedModules = 0;
    let usedPoints = 0;
    const energy = 0;
    let nAdd = 0;
    let lastWasWeapon = false;
    let notEnergy = false;

    while (usedPoints < design.type.maxPoints && nAdd < 30) {
      nAdd++;
      let module: Module;
      let pointToUse = 1;

      if (
        nAdd < 25 &&
        !(energy === 0 && usedPoints - design.type.maxPoints === 1)
      ) {
        if (
          Math.random() + (lastWasWeapon ? -0.2 : +0.2) >
          this.weaponDefenceRatio
        ) {
          // Add Weapon
          module = sample(this.favouriteWeapons);
          lastWasWeapon = true;
        } else {
          // Add Defence
          const chooseList = this.basicDefences.slice(0);
          if (design.modules.findIndex((m) => m.module.id === "A") > -1) {
            this.favouriteDefences.forEach((def) => {
              if (def.armourDamageReduction > 0) {
                chooseList.push(def);
              }
            });
          }
          if (design.modules.findIndex((m) => m.module.id === "s") > -1) {
            this.favouriteDefences.forEach((def) => {
              if (def.shieldDamageReduction > 0) {
                chooseList.push(def);
              }
            });
          }

          module = sample(chooseList);
          lastWasWeapon = false;
        }
        if (notEnergy && module.energy < 0) {
          module = sm.armour;
        }

        pointToUse = Math.min(
          5,
          Math.max(1, Math.floor((design.type.maxPoints - usedPoints) / 4))
        );
      } else {
        module = sm.armour;
      }
      let tempEnergy = energy + pointToUse * module.energy;
      let tempUsedPoint = usedPoints + pointToUse;
      let copy = design.getCopy(false);
      let nTry = 0;

      // Energy
      if (!isDefence) {
        while (tempEnergy < 0 && nTry < 10) {
          nTry++;
          const lastGen =
            copy.modules.length > 0
              ? copy.modules.find(
                  (m) =>
                    m.module &&
                    m.module.energy > 0 &&
                    (m.size < 5 || m.module.energy < this.maxGenerator)
                )
              : null;
          if (lastGen) {
            if (
              lastGen.size < 5 &&
              lastGen.module.energy < this.maxGenerator &&
              tempUsedPoint < design.type.maxPoints
            ) {
              if (this.preferHighLevGen) {
                const last = lastGen.module.id;
                const prevEnergy = lastGen.module.energy;
                const newGen = sm.allGenerators.find(
                  (g) =>
                    g.energy > lastGen.module.energy &&
                    lastGen.module.energy < this.maxGenerator
                );
                if (newGen) {
                  lastGen.module = newGen;
                }
                if (last !== lastGen.module.id) {
                  tempEnergy += lastGen.module.energy - prevEnergy;
                }
              } else {
                lastGen.size++;
                tempUsedPoint++;
                tempEnergy += lastGen.module.energy;
              }
            } else {
              if (lastGen.size < 5 && tempUsedPoint < design.type.maxPoints) {
                lastGen.size++;
                tempUsedPoint++;
                tempEnergy += lastGen.module.energy;
              } else {
                const last = lastGen.module.id;
                const prevEnergy = lastGen.module.energy;
                const newGen = sm.allGenerators.find(
                  (g) =>
                    g.energy > lastGen.module.energy &&
                    lastGen.module.energy < this.maxGenerator
                );
                if (newGen) {
                  lastGen.module = newGen;
                }
                if (last !== lastGen.module.id) {
                  tempEnergy += lastGen.module.energy - prevEnergy;
                }
              }
            }
          } else {
            if (
              copy.modules.length < design.type.maxModule - 1 &&
              tempUsedPoint < design.type.maxPoints
            ) {
              const gen = sm.allGenerators.find((g) => g.energy > 0);
              copy.modules.push({
                module: gen,
                level: this.modLevel,
                size: 1
              });
              tempUsedPoint++;
              tempEnergy += gen.energy;
            }
          }
        }
        notEnergy = tempEnergy < 0;
      } else {
        tempEnergy = 10;
        notEnergy = false;
      }
      if (tempEnergy >= 0 && tempUsedPoint <= design.type.maxPoints) {
        copy.reload(false);
        if (copy.valid) {
          const line = copy.modules.find(
            (m) => m.module.id === module.id && m.size < 5
          );
          if (line) {
            line.size++;
          } else {
            copy.modules.push({
              module,
              level: this.modLevel,
              size: pointToUse
            });
          }
        }
        copy.reload(false);
        if (copy.valid) {
          design.modules = copy.modules;
        }
        copy = null;
      }

      usedPoints = 0;
      usedModules = design.modules.length;
      for (let i = 0; i < usedModules; i++) {
        usedPoints += design.modules[i].size;
      }
    }

    design.reload(false);
    return design;
  }
  generateName() {
    this.name = sample(enemyNames) + " " + sample(enemySuffixes);
    this.icon = sample(icons);
    this.icon = this.icon.replace(".svg", "");
  }

  //#region Save and Load
  getSave(): any {
    const ret: any = {
      l: this.level,
      n: this.name,
      i: this.icon,
      d: this.designs.map((des) => des.getEnemySave()),
      s: this.distance
    };
    if (this.cells) {
      ret.c = this.cells.map((c) => c.getSave());
    }
    if (this.tiles && this.tiles.length > 0) {
      ret.e = this.tiles.map((extra) => {
        return {
          n: extra.number,
          u: extra.unit.id
        };
      });
    }
    return ret;
  }
  load(data: any) {
    const rs = Game.getGame().resourceManager;
    if ("l" in data) {
      this.level = data.l;
    }
    if ("n" in data) {
      this.name = data.n;
    }
    if ("i" in data) {
      this.icon = data.i;
    }
    if ("s" in data) {
      this.distance = new Decimal(data.s);
    }
    if ("d" in data) {
      this.designs = data.d.map((designData) => {
        const design = new ShipDesign();
        design.loadEnemy(designData);
        return design;
      });
    }
    let k = 0;
    if ("c" in data) {
      this.cells = data.c.map((cellData) => {
        const cell = new Cell();
        cell.index = k;
        k++;
        cell.load(cellData);
        return cell;
      });
    }
    for (let i = 0, n = this.designs.length; i < n; i++) {
      this.designs[i].id = i;
    }
    if ("e" in data) {
      this.tiles = [];
      for (let i = 0, n = data.e.length; i < n; i++) {
        const unit = rs.units.find((u) => u.id === data.e[i].u);
        if (unit) {
          this.tiles.push({ number: data.e[i].n, unit });
        }
      }
    }
    this.reloadTotalNavalCap();
    for (let i = 0; i < 100; i++) {
      this.reloadCell(i);
    }
  }
  //#endregion
}
