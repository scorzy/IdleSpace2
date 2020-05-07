import { Unit } from "./unit";
import { IDepartmentData } from "../data/departments";
import assign from "lodash-es/assign";
import { Research } from "../researches/research";
import { IBase } from "../iBase";
import { ONE, ZERO } from "../CONSTANTS";

export class Department implements IDepartmentData, IBase {
  id: string;
  name: string;
  description: string;
  quantity = ZERO;
  constructor(depData: IDepartmentData) {
    assign(this, depData);
  }
}
export class Building extends Unit {
  maxDepartments = 0;
  usedDepartments = 0;
  departments: Array<Department>;
  departmentResearches: Array<Research>;
  addDep(dep: Department) {
    if (this.usedDepartments < this.maxDepartments) {
      dep.quantity = dep.quantity.plus(1);
      this.usedDepartments++;
    }
  }
  reloadMaxDep() {
    if (!this.departmentResearches) return false;
    this.maxDepartments = 0;
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
  }
  postUpdate() {
    super.postUpdate();
    this.reloadMaxDep();
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.d = this.departments.map((dep) => {
      const depSave: any = {
        i: dep.id
      };
      if (!dep.quantity.eq(0)) {
        depSave.q = dep.quantity;
      }
      return depSave;
    });
    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("d" in save) {
      for (const depSave of save.d) {
        if ("q" in depSave) {
          const department = this.departments.find((d) => d.id === depSave.i);
          if (department) {
            department.quantity = depSave.q;
            this.usedDepartments += department.quantity.toNumber();
          }
        }
      }
    }
  }
  //#endregion
}
