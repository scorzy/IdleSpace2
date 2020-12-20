import { Injectable, EventEmitter } from "@angular/core";
declare let numberformat;

export const THEMES = ["dark-green", "dark-blue", "light-green", "light-blue"];

@Injectable({
  providedIn: "root"
})
export class OptionsService {
  static isDark = true;
  static usaFormat = true;
  static instance: OptionsService;
  formatter: any;
  formatEmitter: EventEmitter<number> = new EventEmitter<number>();
  numFormat = "scientific";
  formatId = 0;
  timeFormatDetail = true;
  themeId = "dark-blue";
  darkSide = true;
  darkHeader = true;
  compactCardHeader = false;
  battleWinNotification = true;
  battleLostNotification = true;
  smallWarpNoti = true;
  allWarpNoti = true;
  prodStopNoti = true;
  expNoti = true;
  enemyDefeatNoti = true;
  researchNoti = true;
  researchBoostNoti = true;
  challengeNoti = true;

  showComponentsInfo = true;
  showDronesStatus = true;
  spaceStationNotifications = true;
  listUi = true;
  showDescriptions = true;

  districtInfo = true;
  operativityInfo = true;
  warpKeys: {
    id: number;
    key: string;
    minutes: number;
  }[];
  lastWarpId = 3;
  constructor() {
    try {
      const n = 1.1;
      const separator = n.toLocaleString().substring(1, 2);
      if (separator === ",") {
        OptionsService.usaFormat = false;
      }
    } catch (ex) {}

    this.generateFormatter();
    OptionsService.instance = this;
    this.warpKeys = [
      {
        id: 1,
        key: "m",
        minutes: 1
      },
      { id: 2, key: "h", minutes: 60 },
      { id: 3, key: "g", minutes: 1440 }
    ];
  }
  generateFormatter() {
    this.formatId++;
    try {
      this.formatter = new numberformat.Formatter({
        format: this.numFormat,
        flavor: "short",
        backend: "decimal.js",
        Decimal
      });
    } catch (ex) {
      console.log("Error generate Formatter:" + ex);
    }
    this.formatEmitter.emit(1);
  }
  setHeaderTheme() {
    OptionsService.isDark = !(
      typeof this.themeId === "string" && this.themeId.includes("light")
    );
    this.darkHeader = !OptionsService.isDark && this.darkSide;
  }

  getSave(): any {
    return {
      u: OptionsService.usaFormat,
      t: this.themeId,
      d: this.darkSide,
      c: this.compactCardHeader,
      bw: this.battleWinNotification,
      bl: this.battleLostNotification,
      n: this.numFormat,
      w3: this.allWarpNoti,
      w4: this.smallWarpNoti,
      psn: this.prodStopNoti,
      ci: this.showComponentsInfo,
      ds: this.showDronesStatus,
      t1: this.districtInfo,
      t2: this.operativityInfo,
      s: this.spaceStationNotifications,
      l: this.listUi,
      f: this.showDescriptions,
      en: this.expNoti,
      ed: this.enemyDefeatNoti,
      rn: this.researchNoti,
      rb: this.researchBoostNoti,
      k: this.challengeNoti,
      wk: this.warpKeys.map((warpKey) => [warpKey.key, warpKey.minutes])
    };
  }
  load(data: any) {
    if ("ps" in data) this.prodStopNoti = !data.ps;
    if ("w1" in data) this.allWarpNoti = !data.w1;
    if ("w2" in data) this.smallWarpNoti = !data.w2;

    if ("u" in data) OptionsService.usaFormat = data.u;
    if ("t" in data) this.themeId = data.t;
    if ("d" in data) this.darkSide = data.d;
    if ("c" in data) this.compactCardHeader = data.c;
    if ("bw" in data) this.battleWinNotification = data.bw;
    if ("bl" in data) this.battleLostNotification = data.bl;
    if ("n" in data) this.numFormat = data.n;
    if ("w3" in data) this.allWarpNoti = data.w3;
    if ("w4" in data) this.smallWarpNoti = data.w4;
    if ("psn" in data) this.prodStopNoti = data.psn;
    if ("ci" in data) this.showComponentsInfo = data.ci;
    if ("ds" in data) this.showDronesStatus = data.ds;
    if ("s" in data) this.spaceStationNotifications = data.s;
    if ("l" in data) this.listUi = data.l;
    if ("f" in data) this.showDescriptions = data.f;
    if ("en" in data) this.expNoti = data.en;
    if ("ed" in data) this.enemyDefeatNoti = data.ed;
    if ("rn" in data) this.researchNoti = data.rn;
    if ("rb" in data) this.researchBoostNoti = data.rb;
    if ("k" in data) this.challengeNoti = data.k;

    if ("t1" in data) this.districtInfo = data.t1;
    if ("t2" in data) this.operativityInfo = data.t2;
    this.generateFormatter();

    if ("wk" in data) {
      this.warpKeys = [];
      this.lastWarpId = 1;
      for (const warpKey of data.wk) {
        this.warpKeys.push({
          id: ++this.lastWarpId,
          key: warpKey[0],
          minutes: warpKey[1]
        });
      }
    }
  }
}
