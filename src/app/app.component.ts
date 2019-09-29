import { Component } from "@angular/core";
import { MainService } from "./main.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  visible = false;
  constructor(public ms: MainService) {}

  open(): void {
    this.ms.isCollapsed = false;
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
