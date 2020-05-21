import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "./main.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { OptionsService } from "./options.service";
import { fadeIn } from "./animations";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @ViewChild("saveNoti", { static: false })
  private saveNoti: TemplateRef<any>;
  @ViewChild("loadNoti", { static: false })
  private loadNoti: TemplateRef<any>;

  loadMessage = "";

  visible = false;
  constructor(
    public ms: MainService,
    public os: OptionsService,
    private notification: NzNotificationService,
    private cd: ChangeDetectorRef
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
      this.ms.notificationEmitter.subscribe((n) => {
        let template = this.saveNoti;
        switch (n.type) {
          case 1:
            template = this.saveNoti;
            this.notification.template(template);
            break;
          case 2:
            this.notification.create("info", n.title, n.text);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
