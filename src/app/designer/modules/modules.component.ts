import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { Module } from "src/app/model/shipyard/module";

@Component({
  selector: "app-modules",
  templateUrl: "./modules.component.html",
  styleUrls: ["./modules.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulesComponent implements OnInit {
  modules: Module[];
  type = "a";
  status = "u";

  constructor(public ms: MainService) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    switch (this.type) {
      case "a":
        this.modules = this.ms.game.shipyardManager.modules.slice(0);
        break;
      case "w":
        this.modules = this.ms.game.shipyardManager.modules.filter(
          m => m.damage > 0
        );
        break;
      case "d":
        this.modules = this.ms.game.shipyardManager.defences.filter(
          m => m.armour > 0 || m.shield > 0
        );
        break;
      case "g":
        this.modules = this.ms.game.shipyardManager.generators.filter(
          m => m.energy > 0
        );
        break;
      case "o":
        this.modules = this.ms.game.shipyardManager.generators.filter(
          m => m.damage <= 0 && m.armour <= 0 && m.shield <= 0 && m.energy <= 0
        );
        break;
    }
    if (this.status === "u") {
      this.modules = this.modules.filter(m => m.unlocked);
    }
    if (this.status === "l") {
      this.modules = this.modules.filter(m => !m.unlocked);
    }
  }
}
