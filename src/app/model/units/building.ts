import { Unit } from "./unit";
import { IDepartmentData } from "../data/departments";
import assign from "lodash-es/assign";
import { Research } from "../researches/research";
import { IBase } from "../iBase";
import { BUILDING_ICON, DEPARTMENT_ICON, ZERO } from "../CONSTANTS";
import { AutoBuilding } from "../automation/autoBuilding";
import { Game } from "../game";
import { BonusStack } from "../bonus/bonusStack";

export class Department implements IDepartmentData, IBase {
  id: string;
  name: string;
  description: string;
  quantity = ZERO;
  priority = 0;
  typeIcon = DEPARTMENT_ICON;

  constructor(depData: IDepartmentData) {
    assign(this, depData);
  }
}

export class Building extends Unit {
  maxDepartments = 0;
  usedDepartments = 0;
  departments: Array<Department>;
  departmentResearches: Array<Research>;
  researchesToInspire: Array<Research>;
  autoBuyer: AutoBuilding;
  autoDepartments = false;
  departmentsAck: IBase;
  typeIcon = BUILDING_ICON;
  addDep(dep: Department) {
    if (this.usedDepartments < this.maxDepartments) {
      dep.quantity = dep.quantity.plus(1);
      this.usedDepartments++;
    }
  }
  reloadMaxDep() {
    if (!this.departmentResearches) return false;
    this.maxDepartments = 0;
    if (this.departmentsAck) {
      this.maxDepartments = this.departmentsAck.quantity.toNumber();
    }
    for (let i = 0, n = this.departmentResearches.length; i < n; i++) {
      for (
        let k = 0, n2 = this.departmentResearches[i].buildingPoints.length;
        k < n2;
        k++
      ) {
        if (this.departmentResearches[i].buildingPoints[k].building === this) {
          this.maxDepartments +=
            this.departmentResearches[i].buildingPoints[k].quantity *
            this.departmentResearches[i].quantity.toNumber();
        }
      }
    }
    if (Game.getGame().prestigeManager.doubleDepartmentsCard.active) {
      this.maxDepartments *= 2;
    }
  }
  postUpdate() {
    super.postUpdate();
    this.reloadMaxDep();
    if (this.autoDepartments && this.maxDepartments > this.usedDepartments) {
      let priSum = 0;
      let dep: Department;
      let minPercent = Decimal.MAX_VALUE;
      for (let i = 0, n = this.departments.length; i < n; i++) {
        priSum += this.departments[i].priority;
      }
      for (let i = 0, n = this.departments.length; i < n; i++) {
        if (this.departments[i].priority > 0) {
          const percent = this.departments[i].quantity
            .div(this.departments[i].priority)
            .div(priSum);
          if (percent.lt(minPercent)) {
            minPercent = percent;
            dep = this.departments[i];
          }
        }
      }
      if (dep) {
        this.addDep(dep);
        this.reloadMaxDep();
      }
    }
  }
  /**
   * Inspire first research available
   */
  afterBuy(): boolean {
    if (!this.researchesToInspire) return false;
    for (let i = 0, n = this.researchesToInspire.length; i < n; i++) {
      this.researchesToInspire[i].inspire();
    }
    return true;
  }
  prestige() {
    super.prestige();
    this.maxDepartments = 0;
    this.usedDepartments = 0;
    this.departments?.forEach((dep) => (dep.quantity = ZERO));
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    if (this.departments) {
      ret.d = this.departments.map((dep) => {
        const depSave: any = {
          i: dep.id
        };
        if (!dep.quantity.eq(0)) {
          depSave.q = dep.quantity;
        }
        if (dep.priority !== 0) {
          depSave.r = dep.priority;
        }
        return depSave;
      });
    }
    ret.aDe = this.autoDepartments;

    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("aDe" in save) this.autoDepartments = save.aDe;
    if ("d" in save) {
      for (const depSave of save.d) {
        if ("i" in depSave) {
          const department = this.departments.find((d) => d.id === depSave.i);
          if (department) {
            department.quantity = new Decimal(depSave.q);
            if ("r" in depSave) {
              department.priority = depSave.r;
            }
            this.usedDepartments += department.quantity.toNumber();
          }
        }
      }
    }
  }
  //#endregion
}
