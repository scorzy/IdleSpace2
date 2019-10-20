import { Injectable, EventEmitter } from "@angular/core";
import { Game } from "./model/game";

@Injectable({
  providedIn: "root"
})
export class MainService {
  isCollapsed = false;
  sideTheme = "dark";
  game: Game;
  last: number;
  updateEmitter = new EventEmitter<number>();

  constructor() {
    this.game = new Game();
    this.last = Date.now();
    setInterval(this.update.bind(this), 250);
  }

  update() {
    if (!this.game) {
      return;
    }
    const now = Date.now();
    const diff = now - this.last;
    this.game.update(diff / 1000);
    this.last = now;

    this.updateEmitter.emit(this.last);
  }
}
