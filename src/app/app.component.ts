import { Component } from "@angular/core";
import { MainService } from "./main.service";
import { NzIconService } from "ng-zorro-antd";
import { addIcons } from "./model/icons";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  visible = false;
  constructor(public ms: MainService, private _iconService: NzIconService) {
    addIcons(_iconService);
  }

  open(): void {
    this.ms.isCollapsed = false;
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
