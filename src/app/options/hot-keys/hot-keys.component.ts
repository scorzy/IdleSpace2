import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

@Component({
  selector: "app-hot-keys",
  templateUrl: "./hot-keys.component.html",
  styleUrls: ["./hot-keys.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotKeysComponent implements OnInit {
  constructor(public ms: MainService, public os: OptionsService) {}

  ngOnInit(): void {}
  getIndex(index: number, key: any) {
    return "id" in key ? key.id : index;
  }
  removeField(warpKey: any) {
    this.os.warpKeys = this.os.warpKeys.filter((wk) => wk !== warpKey);
  }
  addLine() {
    this.os.warpKeys.push({ id: ++this.os.lastWarpId, key: "", minutes: 0 });
  }
}
