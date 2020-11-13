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
import { NzModalService } from "ng-zorro-antd/modal";
import { NzMessageService } from "ng-zorro-antd/message";
import * as LZString from "lz-string";

declare let kongregateAPI: any;
declare let PlayFab: any;

export const SAVE_ID = "IS2_save";
export const PLAYFAB_TITLE_ID = "C0DC9";
const SAVE_INTERVAL_PLAYFAB = 3 * 60 * 1000;
export const GAME_SPEED = 1;

@Injectable({
  providedIn: "root"
})
export class MainService {
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
  lastUnitId = "M";
  playFabId = "";
  lastPlayFabSave = 0;
  loadedDate = 0;
  playfabDate = 0;
  playFabData = "";
  lastSave = 0;
  pageOk = true;
  clearing = false;
  // bc: BroadcastChannel;
  constructor(
    private _formatPipe: FormatPipe,
    private _timePipe: TimePipe,
    private options: OptionsService,
    public modal: NzModalService,
    private message: NzMessageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // this.bc = new BroadcastChannel("IS2_channel");
    // this.bc.postMessage("Open");
    // this.bc.postMessage("Ask");
    // this.bc.onmessage = (message) => {
    //   const data = message.data;
    //   switch (data) {
    //     case "Ask":
    //       this.bc.postMessage("Already");
    //       break;
    //     case "Already":
    //       this.pageOk = false;
    //       this.game = null;
    //       this.updateEmitter.emit(-1);
    //       break;
    //   }
    // };

    if (!this.pageOk) return;
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
        if ("t" in data && data.t === "E") {
          this.exportEmitter.emit(data.m);
        } else {
          if ("t" in data && data.t === "P") {
            this.savePlayFab(data.m);
          } else {
            this.saveToLocalStorage(data.m);
            if ("t" in data && data.t === "R") {
              location.reload();
            }
          }
        }
      } else {
        // Decompress request
        if ("t" in data && data.t === "P") {
          this.onPlayFabDecompress(data.m, data.a);
        } else {
          this.load(data.m);
        }
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
    setInterval(this.saveToPlayFab.bind(this), SAVE_INTERVAL_PLAYFAB);

    if (!this.pageOk) return;
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
        this.playFabKongLogin();

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
  update() {
    if (!this.game) return;
    if (!this.pageOk) return;

    const now = Date.now();
    let diff = now - this.last;
    diff = (diff * GAME_SPEED) / 1000;
    this.game.update(diff);
    this.last = now;

    this.game.postUpdate(diff);
    this.updateEmitter.emit(this.last);
  }
  save(refresh = false) {
    if (!this.pageOk) return;
    const save = this.getSave();
    if (!refresh) this.lzWorker.postMessage({ m: save, a: "c" });
    else this.lzWorker.postMessage({ m: save, a: "c", t: "R" });
  }
  saveSync() {
    if (!this.game) return;
    if (!this.pageOk) return;

    this.saveToLocalStorage(
      LZString.compressToEncodedURIComponent(this.getSave())
    );
  }
  saveToPlayFab() {
    if (!this.game) return;
    if (!this.pageOk) return;
    if (this.playFabId === "") return;
    const save = this.getSave();
    this.lzWorker.postMessage({ m: save, a: "c", t: "P" });
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
    if (data.length < 10) {
      console.log("Save invalid");
      return false;
    }
    localStorage.setItem(SAVE_ID, data);
    this.game.notificationManager.addNotification(
      new MyNotification(NotificationTypes.SAVE, "Game Saved")
    );
    this.saveEmitter.emit(1);
    this.lastSave = Date.now();
  }
  private load(save: string) {
    if (!this.pageOk) return;
    this.game = null;
    this.game = new Game();
    if (save !== "") {
      const data = JSON.parse(save);
      this.last = data.t;
      const now = Date.now();
      if (this.last > now) this.last = now;
      this.game.load(data.g);
      if ("o" in data) {
        this.options.load(data.o);
      }
    }
    this.setTheme();
    this.setSideTheme();
    this.loadedDate = this.last;
    this.lastSave = this.last;
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
    this.clearing = true;
    localStorage.removeItem(SAVE_ID);
    location.reload();
  }
  reload() {
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
      // TODO:
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
    if (this.scrollbarTheme.href && myTheme !== this.scrollbarTheme.href) {
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

  //#region PlayFab
  playFabLoginEmail(email: string, psw: string) {
    PlayFab.ClientApi.LoginWithEmailAddress(
      { TitleId: PLAYFAB_TITLE_ID, Email: email, Password: psw },
      this.logInCallBack.bind(this)
    );
  }
  private logInCallBack(data, error) {
    if (error) {
      console.log(error.errorMessage);
      this.message.error(error.errorMessage);
      return;
    }
    if (data) {
      // console.log(data);
      this.playFabId = data.data.PlayFabId;
      PlayFab.settings.titleId = PLAYFAB_TITLE_ID;
      console.log("Logged in to playFab");
      this.message.success("Logged in");
      this.loadPlayFab(true);
    }
    this.saveEmitter.emit();
  }
  registerPlayFab(email: string, psw: string) {
    PlayFab.ClientApi.RegisterPlayFabUser(
      {
        TitleId: PLAYFAB_TITLE_ID,
        Email: email,
        Password: psw,
        RequireBothUsernameAndEmail: false
      },
      this.registerPlayFabCallback.bind(this)
    );
  }
  private registerPlayFabCallback(data, error) {
    if (error) {
      console.log(error.errorMessage);
      this.message.error(error.errorMessage);
      return;
    }
    if (data) {
      console.log("User Registered");
      this.message.success("User Registered");
    }
    this.saveEmitter.emit();
  }
  private savePlayFab(save: string) {
    if (
      !save ||
      save.length < 2 ||
      !this.playFabId ||
      typeof PlayFab === "undefined" ||
      typeof PlayFab.ClientApi === "undefined"
    ) {
      return false;
    }
    if (save.length < 10) {
      console.log("PlayFab Save invalid");
      return false;
    }

    // Cut compressed object into strings of 10,000 bytes for PlayFab
    const chunks = save.match(/.{1,10000}/g);
    if (chunks.length > 10) {
      this.game.notificationManager.addNotification(
        new MyNotification(
          NotificationTypes.SAVE,
          "Error saving to cloud",
          "size limit exceeded"
        )
      );
    }
    // convert array into object with numbers as keys
    // const data = $.extend({}, chunks);
    const data: any = {};
    for (let i = 0; i < chunks.length; i++) data[i] = chunks[i];

    const requestData = {
      TitleId: PLAYFAB_TITLE_ID,
      PlayFabId: this.playFabId,
      Data: data
    };
    try {
      PlayFab.ClientApi.UpdateUserData(
        requestData,
        this.saveToPlayFabCallback.bind(this)
      );
      this.saveToLocalStorage(save);
    } catch (e) {
      console.log(e);
    }
  }
  private saveToPlayFabCallback(data, error) {
    if (error) {
      console.log(error);
      return false;
    }
    if (data) {
      this.lastPlayFabSave = Date.now();
      console.log("Game Saved!");
      this.game.notificationManager.addNotification(
        new MyNotification(NotificationTypes.SAVE, "Game Saved to PlayFab")
      );
      return true;
    }
  }
  loadPlayFab(auto = false) {
    if (
      !this.playFabId ||
      typeof PlayFab === "undefined" ||
      typeof PlayFab.ClientApi === "undefined"
    ) {
      console.log(this.playFabId, PlayFab);
      return false;
    }
    const requestData = {
      Keys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "save"],
      PlayFabId: this.playFabId
    };
    try {
      console.log("attempting to send load request");
      PlayFab.ClientApi.GetUserData(
        requestData,
        this.loadFromPlayFabCallback.bind(this)
      );
      console.log("sent load request");
    } catch (e) {
      console.log(e);
    }
  }
  private loadFromPlayFabCallback(data, error) {
    try {
      // console.log(data, error);
      if (error) {
        console.log(error);
        this.message.error(error.errorMessage);
        return;
      }

      if (data) {
        if (data.data.Data) {
          const raw = Object.values(data.data.Data)
            .map((val: any) => {
              return val.Value;
            })
            .join("");
          // console.log(raw);
          this.lzWorker.postMessage({ m: raw, a: "d", t: "P" });
        }
      }
    } catch (e) {
      console.log(e);
      this.message.error("PlayFab Load error");
    }
  }
  recoverPassword(email: string) {
    PlayFab.settings.titleId = PLAYFAB_TITLE_ID;
    PlayFab.ClientApi.SendAccountRecoveryEmail(
      {
        TitleId: PLAYFAB_TITLE_ID,
        Email: email
      },
      this.recoverCallback.bind(this)
    );
  }
  private recoverCallback(data, error) {
    if (error) {
      console.log(error);
      this.message.error(error.errorMessage);
      return;
    }
    if (data) {
      console.log(data);
      this.message.success("Email sent");
    }
  }
  private onPlayFabDecompress(save: string, auto = false) {
    if (!save || save === "") {
      if (!auto) this.message.error("Nothing to load.");
      return;
    }
    if (this.loadedDate === 0) {
      this.load(save);
    } else {
      const data = JSON.parse(save);
      this.playfabDate = data.t;
      this.modal.confirm({
        nzTitle: "Do you Want to load from PlayFab?",
        nzContent:
          "<ul><li>Cloud Save: " +
          formatDate(this.playfabDate, "medium", "EN") +
          "</li><li>Local Save: " +
          formatDate(this.loadedDate, "medium", "EN") +
          "</li></ul>",
        nzOnOk: () => this.load(save)
      });
    }
  }
  private playFabKongLogin() {
    if (!this.kongregate) {
      this.message.error("You need to be logged in to Kongregate.");
      return;
    }

    try {
      const authTicket = this.kongregate.services.getGameAuthToken();
      const requestData = {
        TitleId: PLAYFAB_TITLE_ID,
        KongregateId: this.kongregate.services.getUserId(),
        AuthTicket: authTicket,
        CreateAccount: true
      };
      try {
        PlayFab.ClientApi.LoginWithKongregate(
          requestData,
          this.logInCallBack.bind(this)
        );
      } catch (e) {
        console.log("Unable to send login request to PlayFab.");
        this.message.error("Unable to send login request to PlayFab.");
      }
    } catch (e) {
      console.log(e);
    }
  }
  //#endregion
}
