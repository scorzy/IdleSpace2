import { Injectable, EventEmitter } from "@angular/core";
import { Game } from "./model/game";
import { formatDate } from "@angular/common";

export const SAVE_ID = "IA3_save";

@Injectable({
  providedIn: "root"
})
export class MainService {
  isCollapsed = true;
  sideTheme = "dark";
  game: Game;
  last: number;
  updateEmitter = new EventEmitter<number>();
  lzWorker: Worker;
  notificationEmitter = new EventEmitter<{
    type: number;
    title?: string;
    text?: string;
  }>();

  constructor() {
    this.last = Date.now();

    // I should check that if the broser supports web workers
    // however i don't really care
    // without web worker the game doesn't work at all
    // i will handle it on the loading screen
    this.lzWorker = new Worker("./lz-string.worker", { type: "module" });
    this.lzWorker.onmessage = ({ data }) => {
      if ("a" in data && data.a === "c") {
        //  Compress request
        this.saveToLocalStorage(data.m);
      } else {
        // Decompress request
        this.load(data.m);
      }
    };

    setInterval(this.update.bind(this), 250);

    const dataSave = localStorage.getItem(SAVE_ID);
    if (dataSave) this.loadFromLocalStorage(true);
    else this.game = new Game();
  }

  update() {
    if (!this.game) {
      return;
    }
    const now = Date.now();
    const diff = now - this.last;
    // diff = diff * 10;
    this.game.update(diff / 1000);
    this.last = now;

    this.game.postUpdate();
    this.updateEmitter.emit(this.last);
  }

  save() {
    const save = this.getSave();
    this.lzWorker.postMessage({ m: save, a: "c" });
  }
  private getSave(): string {
    if (!this.game) return "";
    const save = {
      t: this.last,
      g: this.game.getSave()
    };
    return JSON.stringify(save);
  }
  private saveToLocalStorage(data: string) {
    localStorage.setItem(SAVE_ID, data);
    this.notificationEmitter.emit({ type: 1 });
  }
  private load(save: string) {
    const data = JSON.parse(save);
    this.last = data.t;
    this.game = new Game();
    this.game.load(data.g);
    this.notificationEmitter.emit({
      type: 2,
      title: "Game Loaded",
      text: formatDate(this.last, "medium", "EN")
    });
  }
  decompressAndLoad(data: string) {
    this.lzWorker.postMessage({ m: data, a: "d" });
  }
  loadFromLocalStorage(newGame: boolean) {
    const data = localStorage.getItem(SAVE_ID);
    if (data) {
      this.decompressAndLoad(data);
    }
  }

  clear() {
    localStorage.removeItem(SAVE_ID);
    this.last = Date.now();
    this.game = new Game();
  }
}
