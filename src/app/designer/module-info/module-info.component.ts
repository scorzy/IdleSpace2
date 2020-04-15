import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Module } from "src/app/model/shipyard/module";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-module-info",
  templateUrl: "./module-info.component.html",
  styleUrls: ["./module-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleInfoComponent extends BaseComponentComponent {
  @Input() mod: Module;
  ngOnInit() {}
}
