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
  constructor(public ms: MainService) {}

  ngOnInit() {
    this.modules = this.ms.game.shipyardManager.modules;
  }
}
