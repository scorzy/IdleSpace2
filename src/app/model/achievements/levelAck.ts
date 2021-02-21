import { MainService } from "src/app/main.service";
import { ACK_LEVEL_STR } from "../CONSTANTS";
import { Achievement } from "./achievement";

export abstract class LevelAck extends Achievement {
  next = 1;
  updateDescription() {
    this.next = this.levels[
      Math.min(this.levels.length - 1, this.quantity.toNumber())
    ];
    this.description = this._description.replace(
      ACK_LEVEL_STR,
      this.formatNext(this.next)
    );
  }
  formatNext(next: number | Decimal): string {
    return MainService.formatPipe.transform(next, true);
  }
  checkQuantity() {
    let ret = 0;
    this.progress = this.getCurrentLevel();
    this.levels.forEach((level) => {
      if (Decimal.lt(level, this.progress)) ret++;
    });
    this.progress = Decimal.min(
      this.progress,
      this.levels[this.levels.length - 1]
    );
    return ret;
  }
}
