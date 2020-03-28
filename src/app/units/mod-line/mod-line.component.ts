import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Mod } from "src/app/model/units/mod";
import { parseDecimal } from "src/app/model/utility/parseDecimal";
import { MainService } from "src/app/main.service";
import { Unit } from "src/app/model/units/unit";

@Component({
  selector: "app-mod-line",
  templateUrl: "./mod-line.component.html",
  styleUrls: ["./mod-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModLineComponent implements OnInit {
  @Input() mod: Mod;
  @Input() uiQuantityString: string;
  @Input() unit: Unit;
  constructor() {}
  ngOnInit(): void {}
  valueChange(): void {
    this.mod.uiQuantity = parseDecimal(this.mod.uiQuantityString);
    this.mod.reloadBonus();
    this.reload();
  }
  reload() {
    this.mod.reloadBonus();
    this.unit.production.forEach(prod => {
      prod.reloadMod();
    });
  }
  reformat() {
    this.mod.uiQuantityString = MainService.formatPipe.transform(
      this.mod.uiQuantity,
      true
    );
  }
}
