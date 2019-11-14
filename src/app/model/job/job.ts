import { ZERO } from "../CONSTANTS";

export abstract class Job {
  progress = ZERO;
  total: Decimal;
  max: Decimal;
  level = 0;
  initialPrice: Decimal;
  growRate = 1.1;
  description = "";
  name = "";
  progressPercent = 0;

  /**
   * Adds progress
   * @param progress to add
   * @returns rest
   */
  addProgress(pro: DecimalSource): Decimal {
    this.progress = this.progress.plus(pro);
    let ret: Decimal;
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
    if (this.progress.gte(this.total)) {
      // Completed !
      ret = this.total.minus(this.progress);
      this.progress = ZERO;
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
