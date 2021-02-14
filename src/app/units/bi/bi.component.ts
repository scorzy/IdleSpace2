import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { MainService } from "src/app/main.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-bi",
  templateUrl: "./bi.component.html",
  styleUrls: ["./bi.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BiComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Unit;
  // eslint-disable-next-line
  Number = Number;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private modalService: NzModalService,
    public breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    super(ms, cd);
  }
  ngOnInit(): void {
    this.unit = this.ms.game.resourceManager.unlockedUnits[0];
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
}
