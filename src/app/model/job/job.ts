import { ZERO } from "../CONSTANTS";

export abstract class Job {
  progress: Decimal;
  total: Decimal;
  max: Decimal;
  level = 0;
  initialPrice: Decimal;
  growRate = 1.1;

  /**
   * Adds progress
   * @param progress to add
   * @returns rest
   */
  addProgress(pro: DecimalSource): Decimal {
    this.progress = this.progress.plus(pro);
    let ret: Decimal;
    if (this.progress.gte(this.total)) {
      // Completed !
      ret = this.total.minus(this.progress);
      this.progress = this.total;
      this.level++;
      this.reload();
    } else {
      ret = ZERO;
    }
    return ret;
  }

  onCompleted() {}

  reload() {
    this.total = this.initialPrice.times(
      Decimal.pow(this.growRate, this.level)
    );
  }
}
