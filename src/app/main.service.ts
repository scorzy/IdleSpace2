import { Injectable, EventEmitter, Inject } from "@angular/core";
import { Game } from "./model/game";
import { formatDate, DOCUMENT } from "@angular/common";
import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";
import compiledCss from "./model/data/themes.json";
import { FLEET_NUMBER } from "./model/CONSTANTS";
import {
  NotificationTypes,
  MyNotification
} from "./model/notifications/myNotification";

export const SAVE_ID = "IS2_save";
export const GAME_SPEED = 1;

@Injectable({
  providedIn: "root"
})
export class MainService {
  constructor(
    private _formatPipe: FormatPipe,
    private options: OptionsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.last = Date.now();
    MainService.instance = this;
    MainService.formatPipe = _formatPipe;

    this.theme = this.document.createElement("link");
    this.theme.rel = "stylesheet";
    this.theme.type = "text/css";
    this.document
      .querySelector("head")
      .insertBefore(
        this.theme,
        document
          .getElementsByTagName("head")[0]
          .getElementsByTagName("style")[0]
      );
    this.scrollbarTheme = this.document.createElement("link");
    this.scrollbarTheme.rel = "stylesheet";
    this.scrollbarTheme.type = "text/css";
    this.document
      .querySelector("head")
      .insertBefore(
        this.scrollbarTheme,
        document
          .getElementsByTagName("head")[0]
          .getElementsByTagName("style")[0]
      );

    // I should check that if the browser supports web workers
    // however i don't really care
    // without web worker the game doesn't work at all
    // i will handle it on the loading screen
    this.lzWorker = new Worker("./lz-string.worker", { type: "module" });
    this.lzWorker.onmessage = ({ data }) => {
      if ("a" in data && data.a === "c") {
        //  Compress request
        if ("t" in data) {
          this.exportEmitter.emit(data.m);
        } else {
          this.saveToLocalStorage(data.m);
        }
      } else {
        // Decompress request
        this.load(data.m);
      }
    };

    for (let i = 0; i < FLEET_NUMBER; i++) {
      MainService.battleWorkers[i] = new Worker("./battle.worker", {
        type: "module"
      });
      MainService.battleWorkers[i].onmessage = ({ data }) => {
        this.game.onBattleEnd(data, i);
      };
    }

    setInterval(this.update.bind(this), 100);

    const dataSave = localStorage.getItem(SAVE_ID);
    if (dataSave) this.loadFromLocalStorage(true);
    else this.game = new Game();
    this.setTheme();
    this.ready = true;
  }
  static formatPipe: FormatPipe;
  static battleWorkers = new Array<Worker>(FLEET_NUMBER);
  static instance: MainService;

  theme: HTMLLinkElement;
  scrollbarTheme: HTMLLinkElement;
  isCollapsed = true;
  sideTheme = "dark";
  innerContent = true;
  game: Game;
  last: number;
  updateEmitter = new EventEmitter<number>();
  saveEmitter = new EventEmitter<number>();
  exportEmitter = new EventEmitter<string>();
  lzWorker: Worker;
  enemyListCollapsed = false;
  designListCollapsed = false;
  notificationEmitter = new EventEmitter<MyNotification>();
  ready = false;

  update() {
    if (!this.game) return;

    const now = Date.now();
    let diff = now - this.last;
    diff = diff * GAME_SPEED;
    this.game.update(diff / 1000);
    this.last = now;

    this.game.postUpdate();
    this.updateEmitter.emit(this.last);
  }
  save() {
    const save = this.getSave();
    this.lzWorker.postMessage({ m: save, a: "c" });
  }
  export() {
    const save = this.getSave();
    this.lzWorker.postMessage({ m: save, a: "c", t: "E" });
  }
  private getSave(): string {
    if (!this.game) return "";
    const save = {
      t: this.last,
      g: this.game.getSave(),
      o: this.options.getSave()
    };
    return JSON.stringify(save);
  }
  private saveToLocalStorage(data: string) {
    localStorage.setItem(SAVE_ID, data);
    this.game.notificationManager.addNotification(
      new MyNotification(NotificationTypes.SAVE, "Game Saved")
    );
    this.saveEmitter.emit(1);
  }
  private load(save: string) {
    const data = JSON.parse(save);
    this.last = data.t;
    this.game = new Game();
    this.game.load(data.g);
    if ("o" in data) {
      this.options.load(data.o);
    }
    this.setTheme();
    this.setSideTheme();
    this.notificationEmitter.emit(
      new MyNotification(
        NotificationTypes.LOAD,
        "Game Loaded",
        formatDate(this.last, "medium", "EN")
      )
    );
  }
  decompressAndLoad(data: string) {
    this.lzWorker.postMessage({ m: data, a: "d" });
  }
  loadFromLocalStorage(newGame: boolean = false) {
    const data = localStorage.getItem(SAVE_ID);
    if (data) {
      this.decompressAndLoad(data);
    }
  }
  clear() {
    localStorage.removeItem(SAVE_ID);
    // this.last = Date.now();
    // this.game = new Game();
    // this.setTheme();
    location.reload();
  }
  setTheme() {
    let file = compiledCss.find((n) =>
      n.startsWith(this.options.themeId + ".")
    );
    if (typeof file !== "string" || file === "") file = compiledCss[0];
    const myTheme = "assets/themes/" + file;
    if (myTheme !== this.theme.href) this.theme.href = myTheme;
    this.options.setHeaderTheme();
    this.setScrollbarTheme();
    if (this.game) this.game.setTheme();
  }
  setSideTheme() {
    this.sideTheme = this.options.darkSide ? "dark" : "light";
    this.options.setHeaderTheme();
    this.setScrollbarTheme();
  }
  setScrollbarTheme() {
    const myTheme =
      this.options.darkSide && OptionsService.isDark
        ? "assets/dark-scrollbar.css"
        : "";
    if (myTheme !== this.scrollbarTheme.href) {
      this.scrollbarTheme.href = myTheme;
    }
  }
}
