import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";

export class AutoFull extends AbstractAutobuyer {
  id = "aFull";
  name = "Auto 100%";
  description = "Set all workers to 100%";
  interval = 1e4;
  automate(): boolean {
    const unlockedWorkers = Game.getGame().resourceManager.unlockedWorkers;
    for (const worker of unlockedWorkers) {
      worker.operativity = 100;
    }
    return true;
  }
}
