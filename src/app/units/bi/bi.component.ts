import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { MainService } from "src/app/main.service";
import { NzModalService } from "ng-zorro-antd";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bi",
  templateUrl: "./bi.component.html",
  styleUrls: ["./bi.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BiComponent implements OnInit {
  @Input() unit: Unit;
  Number = Number;
  private subscriptions: Subscription[] = [];
  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private modalService: NzModalService,
    public breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.unit = this.ms.game.resourceManager.unlockedUnits[0];
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
