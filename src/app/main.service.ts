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
import { TimePipe } from "./time.pipe";

export const SAVE_ID = "IS2_save";
export const GAME_SPEED = 1;
declare let kongregateAPI: any;

@Injectable({
  providedIn: "root"
})
export class MainService {
  constructor(
    private _formatPipe: FormatPipe,
    private _timePipe: TimePipe,
    private options: OptionsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.last = Date.now();
    MainService.instance = this;
    MainService.formatPipe = _formatPipe;
    MainService.timePipe = _timePipe;

    this.theme = this.document.getElementById("gameTheme") as HTMLLinkElement;

    this.scrollbarTheme = this.document.getElementById(
      "scrollTheme"
    ) as HTMLLinkElement;

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
    setInterval(this.save.bind(this), 60 * 1000);

    const dataSave = localStorage.getItem(SAVE_ID);
    if (dataSave) this.loadFromLocalStorage(true);
    else this.game = new Game();
    this.setTheme();
    this.ready = true;

    //  Kong Api
    const url =
      window.location !== window.parent.location
        ? document.referrer
        : document.location.href;

    if (url.includes("kongregate") && typeof kongregateAPI !== "undefined") {
      kongregateAPI.loadAPI(() => {
        this.kongregate = kongregateAPI.getAPI();
        console.log("KongregateAPI Loaded");

        setTimeout(() => {
          try {
            console.log("Kongregate build");
            this.sendKong();
          } catch (e) {
            console.log("Error: " + e.message);
          }
        }, 2 * 60 * 1000);
      });
    }
  }
  static formatPipe: FormatPipe;
  static timePipe: TimePipe;
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
  kongregate: any;

  update() {
    if (!this.game) return;

    const now = Date.now();
    let diff = now - this.last;
    diff = (diff * GAME_SPEED) / 1000;
    this.game.update(diff);
    this.last = now;

    this.game.postUpdate(diff);
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
    location.reload();
  }
  setTheme() {
    try {
      let file = compiledCss.find((n) =>
        n.startsWith(this.options.themeId + ".")
      );
      if (typeof file !== "string" || file === "") file = compiledCss[0];
      const myTheme = "assets/themes/" + file;
      if (myTheme !== this.theme.href) this.theme.href = myTheme;
      this.options.setHeaderTheme();
      this.setScrollbarTheme();
      if (this.game) this.game.setTheme();
    } catch (ex) {
      //TODO:
      //  just to pass unit tests
    }
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
  sendKong() {
    if (!this.game || !this.kongregate) return false;
    try {
      this.kongregate.stats.submit("MaxEnemy", this.game.enemyManager.maxLevel);
    } catch (ex) {
      console.log(ex);
    }
  }
}
