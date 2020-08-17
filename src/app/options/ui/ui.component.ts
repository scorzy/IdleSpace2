import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import compiledCss from "../../model/data/themes.json";
import startCase from "lodash-es/startCase";

@Component({
  selector: "app-ui",
  templateUrl: "./ui.component.html",
  styleUrls: ["./ui.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiComponent implements OnInit {
  usaFormat = OptionsService.usaFormat;
  themes = [];
  constructor(public ms: MainService, public os: OptionsService) {}
  ngOnInit(): void {
    this.themes = compiledCss.sort().map((theme) => {
      let str = theme;
      const end = theme.indexOf(".");
      if (end > 0) {
        str = str.substring(0, end);
      }
      return {
        name: startCase(str.replace(/-/g, " ")),
        css: str
      };
    });
  }
  changeUsaFormat() {
    OptionsService.usaFormat = this.usaFormat;
  }
  onFormatChange() {
    this.os.generateFormatter();
  }
  getThemeId(index: number, theme: string) {
    return index + theme;
  }
}
