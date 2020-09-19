import { ZERO } from "../CONSTANTS";
import { Unit } from "../units/unit";
import { Game } from "../game";

export const TO_DO_COLOR = [245, 79, 71];
export const DONE_COLOR = [96, 181, 21];

export const TO_DO_COLOR_DARK = [207, 19, 34];
export const DONE_COLOR_DARK = [56, 158, 13];

export interface IMaterial {
  material: Unit;
  quantity: Decimal;
}
export class Cell {
  index = 0;
  materials: IMaterial[] = [];
  percent = 100;
  done = false;
  inBattle = false;
  color = "rgb(245, 79, 71)";
  ships: Array<number>;
  enemyStrength = 1;
  eta = 0;
  antiMissiles = ZERO;
  addMaterial(material: Unit, quantity: Decimal) {
    if (
      Game.getGame().challengeManager.noHabSpaceChallenge.isActive &&
      material === Game.getGame().resourceManager.habitableSpace
    )
      return;

    if (!this.materials) {
      this.materials = [];
    }
    let cellMaterial: IMaterial = this.materials.find(
      (m) => m.material === material
    );
    if (!cellMaterial) {
      cellMaterial = {
        material,
        quantity: ZERO
      };
      this.materials.push(cellMaterial);
    }
    cellMaterial.quantity = cellMaterial.quantity.plus(
      quantity.times(
        material.battleGainMulti ? material.battleGainMulti.totalBonus : 1
      )
    );
  }
  getNuke(): Decimal {
    Game.getGame().enemyManager.reloadNukeDamage();
    const curEnemy = Game.getGame().enemyManager.currentEnemy;
    if (!curEnemy) {
      return ZERO;
    }
    let ret = ZERO;
    for (let i = 0, n = curEnemy.designs.length; i < n; i++) {
      if (this.ships[i] > 0 && curEnemy.designs[i].isDefence) {
        ret = ret.plus(
          (curEnemy.designs[i].totalArmour +
            curEnemy.designs[i].totalShield +
            curEnemy.designs[i].armourReduction +
            curEnemy.designs[i].shieldReduction) *
            this.ships[i]
        );
      }
    }
    ret = ret.div(Game.getGame().enemyManager.nukeDamage).ceil();
    return this.antiMissiles.plus(ret);
  }
  nuke(totalDamage: number, all: boolean = false) {
    const curEnemy = Game.getGame().enemyManager.currentEnemy;
    if (!curEnemy) {
      return;
    }
    for (let i = 0, n = curEnemy.designs.length; i < n; i++) {
      if (this.ships[i] > 0 && curEnemy.designs[i].isDefence) {
        if (!all) {
          const totalDef =
            curEnemy.designs[i].totalArmour +
            curEnemy.designs[i].totalShield +
            curEnemy.designs[i].armourReduction +
            curEnemy.designs[i].shieldReduction;
          const defeated = Math.min(
            this.ships[i],
            Math.floor(totalDamage / totalDef)
          );
          totalDamage = totalDamage - defeated * totalDef;
          this.ships[i] -= defeated;
          this.ships[i] = Math.max(this.ships[i], 0);
        } else {
          this.ships[i] = 0;
        }
      }
    }
    curEnemy.reloadCell(this.index);
  }

  //#region Save and Load
  getSave(): any {
    const ret: any = {};
    if (this.materials && this.materials.length > 0) {
      ret.m = this.materials.map((mat) => {
        return {
          i: mat.material.id,
          q: mat.quantity
        };
      });
    }
    if (this.ships) {
      ret.s = this.ships;
    }
    if (this.done) {
      ret.d = this.done;
    }
    if (this.antiMissiles.gt(0)) ret.a = this.antiMissiles;
    return ret;
  }
  load(data: any) {
    if ("m" in data) {
      const rs = Game.getGame().resourceManager;
      for (let i = 0, n = data.m.length; i < n; i++) {
        const mat = rs.units.find((u) => u.id === data.m[i].i);
        if (mat) {
          this.materials.push({
            material: mat,
            quantity: new Decimal(data.m[i].q)
          });
        }
      }
    }
    if ("s" in data) {
      this.ships = data.s;
    }
    if ("d" in data) {
      this.done = data.d;
    }
    if ("a" in data) this.antiMissiles = new Decimal(data.a);
  }
  //#endregion
}
