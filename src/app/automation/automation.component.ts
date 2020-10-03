import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { INFRASTRUCTURE_AUTO_LEVEL } from "../model/CONSTANTS";

@Component({
  selector: "app-automation",
  templateUrl: "./automation.component.html",
  styleUrls: ["./automation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomationComponent implements OnInit, AfterViewInit {
  @HostBinding("class.disable-animation") animationDisabled = true;
  INFRASTRUCTURE_AUTO_LEVEL = INFRASTRUCTURE_AUTO_LEVEL;
  constructor(public ms: MainService) {}
  ngOnInit(): void {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.animationDisabled = false;
    });
  }
}
