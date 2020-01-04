import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { Stats } from "../model/battle/battleResult";

@Component({
  selector: "app-battle-report",
  templateUrl: "./battle-report.component.html",
  styleUrls: ["./battle-report.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleReportComponent implements OnInit, OnDestroy {
  stats: Stats[];

  listOfRounds: Array<{ label: string; value: string }> = [
    {
      label: "All",
      value: "6"
    },
    {
      label: "1",
      value: "1"
    },
    {
      label: "2",
      value: "2"
    },
    {
      label: "3",
      value: "3"
    },
    {
      label: "4",
      value: "4"
    },
    {
      label: "5",
      value: "5"
    }
  ];
  listOfSelectedRounds = [];

  listOfValues: Array<{ label: string; value: string }> = [
    {
      label: "Loses",
      value: "Loses"
    },
    {
      label: "Kills",
      value: "Lills"
    },
    {
      label: "Exploded",
      value: "Exploded"
    }
  ];
  listOfSelectedValues = [];

  constructor(public ms: MainService) {}

  ngOnInit() {
    this.ms.game.updateStats = false;
    this.stats = this.ms.game.battleStats[0];
  }
  ngOnDestroy() {
    this.ms.game.updateStats = true;
  }
  getValue(data: Stats, round: string, value: string) {
    const stat = round === "6" ? data.total : data.rounds[parseInt(round, 10)];
    let ret: any = null;
    switch (value) {
      case "Loses":
        ret = stat.lost;
        break;
      case "Kills":
        ret = stat.kills;
        break;
      case "Exploded":
        ret = stat.exploded;
        break;
    }

    return ret;
  }
}
