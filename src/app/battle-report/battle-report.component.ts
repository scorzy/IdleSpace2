import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { Stats } from "../model/battle/battleResult";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-battle-report",
  templateUrl: "./battle-report.component.html",
  styleUrls: ["./battle-report.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleReportComponent extends BaseComponentComponent {
  fleet = -1;
  report = -1;
  stats: Stats[];
  listOfFleets: Array<{ label: string; value: string }> = [];

  listOfRounds: Array<{ label: string; value: string }> = [
    {
      label: "Total",
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

  listOfSelectedValues = [];

  ngOnInit() {
    this.ms.game.updateStats = false;
    for (let i = 0; i < this.ms.game.shipyardManager.maxFleet; i++) {
      this.listOfFleets.push({
        label: "Fleet " + (1 + i),
        value: "" + i
      });
    }
  }
  reload(): void {
    if (this.fleet > -1 && this.report > -1) {
      this.stats = this.ms.game.battleStats[this.fleet][this.report].stats;
    }
  }
  getValue(data: Stats, round: string, value: string) {
    const stat =
      round === "6" ? data.total : data.rounds[parseInt(round, 10) - 1];
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
      case "Quantity":
        ret = stat.quantity;
        break;
      case "quantityEnd":
        ret = stat.quantityEnd;
        break;
      case "OneShotted":
        ret = stat.oneShotted;
        break;
      case "OneShotDone":
        ret = stat.oneShotDone;
        break;

      case "aliveTargets":
        ret = stat.aliveTargets;
        break;
      case "aliveTargetsShield":
        ret = stat.aliveTargetsShield;
        break;
      case "aliveTargetsNoShield":
        ret = stat.aliveTargetsNoShield;
        break;

      case "deathTargets":
        ret = stat.deathTargets;
        break;
      case "explosionTriggered":
        ret = stat.explosionTriggered;
        break;
      case "shotTaken":
        ret = stat.shotTaken;
        break;
      case "shotTakenDeath":
        ret = stat.shotTakenDeath;
        break;

      case "damageDone":
        ret = stat.damageDone;
        break;
      case "armourDamageDone":
        ret = stat.armourDamageDone;
        break;
      case "shieldDamageDone":
        ret = stat.shieldDamageDone;
        break;
      case "damageTaken":
        ret = stat.damageTaken;
        break;
      case "armourDamageTaken":
        ret = stat.armourDamageTaken;
        break;
      case "shieldDamageTaken":
        ret = stat.shieldDamageTaken;
        break;
      case "shieldRegenerationReceived":
        ret = stat.shieldRegenerationReceived;
        break;
      case "threatAvg":
        ret = stat.threatAvg;
        break;
      case "shipHit":
        ret = stat.shipHit;
        break;
      case "defenceHit":
        ret = stat.defenceHit;
        break;
    }

    return ret;
  }
  getValueLabel(key: string) {
    let ret = key;
    switch (key) {
      case "Loses":
        ret = "Loses";
        break;
      case "Kills":
        ret = "Kills";
        break;
      case "Exploded":
        ret = "Exploded";
        break;
      case "Quantity":
        ret = "Quantity - Round Start";
        break;
      case "quantityEnd":
        ret = "Quantity - Round End";
        break;
      case "OneShotted":
        ret = "One Shotted";
        break;
      case "OneShotDone":
        ret = "One Shot Done";
        break;
      case "shotTaken":
        ret = "Shots Taken";
        break;
      case "shotTakenDeath":
        ret = "Shots Taken when dead";
        break;

      case "aliveTargets":
        ret = "Alive Targets";
        break;
      case "aliveTargetsShield":
        ret = "Alive Targets with Shield";
        break;
      case "aliveTargetsNoShield":
        ret = "Alive Targets without Shield";
        break;

      case "shipHit":
        ret = "Ship Targets";
        break;
      case "defenceHit":
        ret = "Defence Targets";
        break;

      case "deathTargets":
        ret = "Death Targets";
        break;
      case "explosionTriggered":
        ret = "Explosion Triggered";
        break;

      case "damageDone":
        ret = "Damage Done";
        break;
      case "armourDamageDone":
        ret = "Armour Damage Done";
        break;
      case "shieldDamageDone":
        ret = "Shield Damage Done";
        break;
      case "damageTaken":
        ret = "Damage Taken";
        break;
      case "armourDamageTaken":
        ret = "Armour Damage Taken";
        break;
      case "shieldDamageTaken":
        ret = "Shield Damage Taken";
        break;

      case "shieldRegenerationReceived":
        ret = "Shield Regeneration Received";
        break;

      case "threatAvg":
        ret = "Threat avg.";
        break;
    }
    return ret;
  }
}
