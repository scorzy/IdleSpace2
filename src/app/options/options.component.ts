import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent extends BaseComponentComponent {
  ngOnInit() {}
}
