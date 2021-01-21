import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { constructor } from "jasmine";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

@Component({
  selector: "app-unit-options",
  templateUrl: "./unit-options.component.html",
  styleUrls: ["./unit-options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitOptionsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  posOptions = [
    { value: "top", label: "top" },
    { value: "left", label: "left" },
    { value: "right", label: "right" },
    { value: "bottom", label: "bottom" }
  ];

  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public os: OptionsService
  ) {
    super(ms, cd);
  }

  ngOnInit(): void {}
}
