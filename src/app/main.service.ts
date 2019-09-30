import { Injectable } from "@angular/core";
import { Game } from "./model/game";

@Injectable({
  providedIn: "root"
})
export class MainService {
  isCollapsed = false;
  sideTheme = "dark";
  game: Game;
  constructor() {
    this.game = new Game();
  }
}
