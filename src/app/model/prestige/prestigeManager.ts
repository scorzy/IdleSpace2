import { ZERO } from "../CONSTANTS";

export class PrestigeManager {
  experience = ZERO;

  //#region Save and Load
  getSave() {
    return {
      e: this.experience
    };
  }
  load(data: any) {
    if ("e" in data) this.experience = new Decimal(data.e);
  }
  //#endregion
}
