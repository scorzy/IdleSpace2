import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-automation",
  templateUrl: "./automation.component.html",
  styleUrls: ["./automation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomationComponent implements OnInit, AfterViewInit {
  @HostBinding("class.disableAnimation") animationDisabled = true;
  constructor(public ms: MainService) {}
  ngOnInit(): void {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.animationDisabled = false;
    });
  }
}
