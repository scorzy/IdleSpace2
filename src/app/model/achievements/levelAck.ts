import { MainService } from "src/app/main.service";
import { Achievement } from "./achievement";

export abstract class LevelAck extends Achievement {
  updateDescription() {
    const next = this.levels[
      Math.min(this.levels.length - 1, this.quantity.toNumber())
    ];
    this.description = this._description.replace(
      "#level@",
      MainService.formatPipe.transform(next, true)
    );
  }
}
