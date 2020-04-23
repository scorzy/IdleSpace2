import { Unit } from "./unit";
import { IUnitData } from "../data/iUnitData";
import { iDepartmentData, RD } from "../data/departments";
import assign from "lodash-es/assign";
export class Department implements iDepartmentData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  constructor(depData: iDepartmentData) {
    assign(this, depData);
  }
}
export class Building extends Unit {
  maxDepartments = 0;
  departments = new Array<Department>();
  getSave(): any {
    const ret = super.getSave();
    ret.d = this.departments.map((dep) => {
      i: dep.id;
      q: dep.quantity;
    });

    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("d" in save) {
      for (let depSave of save.d) {
        const department = this.departments.find((d) => d.id === depSave.i);
        if (department) {
          department.quantity = depSave.q;
        }
      }
    }
  }
}
