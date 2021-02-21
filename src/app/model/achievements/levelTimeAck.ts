import { MainService } from "src/app/main.service";
import { LevelAck } from "./levelAck";

export abstract class LevelTimeAck extends LevelAck {
  formatNext(next: number | Decimal): string {
    return MainService.timePipe.transform(next);
  }
}
