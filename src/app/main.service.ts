import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MainService {
  isCollapsed = false;
  sideTheme = "dark";
  constructor() {}
}
