import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
declare let preventScroll;
@Component({
  selector: "app-base-component",
  templateUrl: "./base-component.component.html",
  styleUrls: ["./base-component.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding("class.disableAnimation") animationDisabled = true;
  protected subscriptions: Subscription[] = [];
  constructor(public ms: MainService, protected cd: ChangeDetectorRef) {}
  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.animationDisabled = false;
    });
    if (typeof preventScroll === typeof Function) preventScroll();
  }
}
