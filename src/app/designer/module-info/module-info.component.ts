import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Module } from "src/app/model/shipyard/module";

@Component({
  selector: "app-module-info",
  templateUrl: "./module-info.component.html",
  styleUrls: ["./module-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleInfoComponent implements OnInit {
  @Input() mod: Module;

  constructor() {}

  ngOnInit() {}
}
