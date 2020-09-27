import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { MainService } from "./main.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { OptionsService } from "./options.service";
import { Subscription } from "rxjs";
import {
  MyNotification,
  NotificationTypes
} from "./model/notifications/myNotification";
import { trigger } from "@angular/animations";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger("noop", [])]
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @ViewChild("customNoti", { static: false })
  private customNoti: TemplateRef<any>;

  @ViewChild("closeNoti", { static: true })
  private closeNoti: TemplateRef<any>;
  loadMessage = "";

  visible = false;
  constructor(
    public ms: MainService,
    public os: OptionsService,
    private notification: NzNotificationService,
    private cd: ChangeDetectorRef,
    private message: NzMessageService
  ) {}

  open(): void {
    this.ms.isCollapsed = false;
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.ms.notificationEmitter.subscribe((n: MyNotification) => {
        if (n.template) {
          let template = this.customNoti;
          template = this.customNoti;
          this.notification.template(template, {
            nzData: n,
            nzCloseIcon: this.closeNoti
          });
        } else {
          switch (n.type) {
            case NotificationTypes.LOAD:
              this.notification.create("info", n.title, n.description, {
                nzCloseIcon: this.closeNoti
              });
              break;
          }
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  @HostListener("window:keyup", ["$event"])
  onKey(event: KeyboardEvent) {
    if ((event.target as Element).tagName !== "BODY") return;
    const warp = this.os.warpKeys.find((k) => k.key === event.key);
    if (warp && warp.minutes > 0) this.ms.game.warp(warp.minutes * 60);
  }
  closeDrawer() {
    this.visible = false;
  }
}
