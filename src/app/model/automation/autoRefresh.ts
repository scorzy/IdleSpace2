import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { MainService } from "src/app/main.service";

export class AutoRefresh extends AbstractAutobuyer {
  constructor() {
    super();
    this.id = "arh";
    this.name = "Save and Reload";
    this.interval = 1e3 * 3600;
    this.on = false;
  }
  automate(): boolean {
    setTimeout(this.saveAndRefresh.bind(this));
    return true;
  }
  saveAndRefresh() {
    MainService.instance.save(true);
  }
}
