import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { FLEET_NUMBER } from "src/app/model/CONSTANTS";
import { json2csvAsync } from "json-2-csv";

@Component({
  selector: "app-report-list",
  templateUrl: "./report-list.component.html",
  styleUrls: ["./report-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportListComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  listOfFleets: Array<{ label: string; value: string }> = [];
  ngOnInit() {
    this.ms.game.updateStats = false;
    super.ngOnInit();
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.listOfFleets.push({
        label: "Fleet " + (1 + i),
        value: "" + i
      });
    }
  }
  ngOnDestroy() {
    this.ms.game.updateStats = true;
    super.ngOnDestroy();
  }
  async download(id: string) {
    const report = this.ms.game.battleStats.find((rep) => rep.id === id);
    if (!report) return;
    // const json = JSON.stringify(report.stats);
    const arr = [];
    report.stats.forEach((stats) => {
      let round = 1;
      stats.rounds.concat(stats.total).forEach((st) => {
        const rep: any = {};
        rep.designId = stats.designId;
        rep.player = stats.player;
        rep.name = stats.name;
        rep.round = round;
        if (round === 6) rep.round = "Total";
        round++;
        Object.assign(rep, st);
        arr.push(rep);
      });
    });
    const options = {
      delimiter: {
        wrap: '"',
        field: "\t",
        eol: "\n"
      }
    };
    const csv = await json2csvAsync(arr, options);
    const myBlob = new Blob([csv], {
      type: "octet/stream"
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(myBlob);
    link.setAttribute("download", "IdleSpace2_" + report.name + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
