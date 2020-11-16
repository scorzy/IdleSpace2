import { ISearchOption } from "../data/iSearchOption";
export class SearchRange {
  min = 0;
  max = 100;
}
export class SearchOption implements ISearchOption {
  id: string;
  name: string;
  min = 0;
  max = 100;
  extendedMax = 200;
  bonusMinStart = 0;
  bonusMinEnd = 0;
  bonusMaxStart = 0;
  bonusMaxEnd = 100;
  quantity = 0;
  tooltip = "";
  constructor(data: ISearchOption) {
    this.id = data.id;
    this.name = data.name;
    if ("min" in data) {
      this.min = data.min;
    }
    if ("max" in data) {
      this.max = data.max;
    }
    if ("extendedMax" in data) {
      this.extendedMax = data.extendedMax;
    }
    if ("bonusMinStart" in data) {
      this.bonusMinStart = data.bonusMinStart;
    }
    if ("bonusMinEnd" in data) {
      this.bonusMinEnd = data.bonusMinEnd;
    }
    if ("bonusMaxStart" in data) {
      this.bonusMaxStart = data.bonusMaxStart;
    }
    if ("bonusMaxEnd" in data) {
      this.bonusMaxEnd = data.bonusMaxEnd;
    }
    if ("tooltip" in data) {
      this.tooltip = data.tooltip;
    }
  }
  getData() {
    const ret: any = { i: this.id };
    if (this.quantity !== 0) {
      ret.q = this.quantity;
    }
    return ret;
  }
  load(data: any) {
    if (!("i" in data && data.i === this.id)) {
      return false;
    }
    if ("q" in data) {
      this.quantity = data.q;
    }
  }
  getRange(qta?: number): SearchRange {
    const level = qta || this.quantity;
    const max = Math.abs(level >= 0 ? this.max : this.min);
    return {
      min:
        this.bonusMinStart +
        ((this.bonusMinEnd - this.bonusMinStart) * Math.abs(level)) / max,
      max:
        this.bonusMaxStart +
        ((this.bonusMaxEnd - this.bonusMaxStart) * Math.abs(level)) / max
    };
  }
}
