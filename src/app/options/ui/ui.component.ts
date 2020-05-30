import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

@Component({
  selector: "app-ui",
  templateUrl: "./ui.component.html",
  styleUrls: ["./ui.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiComponent implements OnInit {
  usaFormat = OptionsService.usaFormat;
  constructor(public ms: MainService, public os: OptionsService) {}
  ngOnInit(): void {}
  changeUsaFormat() {
    OptionsService.usaFormat = this.usaFormat;
  }
  onFormatChange() {
    this.os.generateFormatter();
  }
}
