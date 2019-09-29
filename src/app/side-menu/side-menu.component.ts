import { Component, OnInit, Input } from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"]
})
export class SideMenuComponent implements OnInit {
  @Input() notCollapsed = false;

  constructor(public ms: MainService) {}

  ngOnInit() {}
}
