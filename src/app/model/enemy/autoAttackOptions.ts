export class AutoAttackOption {
  autoAttack = true;
  minPercent = 0;

  getSave(): any {
    const ret: any = { a: this.autoAttack, m: this.minPercent };
    return ret;
  }
  load(data: any) {
    if ("a" in data) this.autoAttack = data.a;
    if ("m" in data) this.minPercent = data.m;
  }
}
