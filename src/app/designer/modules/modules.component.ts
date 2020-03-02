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
        this.modules = this.ms.game.shipyardManager.allWeapons.slice(0);
        break;
      case "d":
        this.modules = this.ms.game.shipyardManager.allDefences.slice(0);
        break;
      case "g":
        this.modules = this.ms.game.shipyardManager.allGenerators.slice(0);
        break;
      case "t":
        this.modules = this.ms.game.shipyardManager.allThrusters.slice(0);
        break;
      case "o":
        this.modules = this.ms.game.shipyardManager.allOthers.slice(0);
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
