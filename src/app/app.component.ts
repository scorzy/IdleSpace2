import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { MainService } from "./main.service";
import { Subscription } from "rxjs";
import { NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @ViewChild("saveNoti", null)
  private saveNoti: TemplateRef<any>;
  @ViewChild("loadNoti", null)
  private loadNoti: TemplateRef<any>;

  loadMessage = "";

  visible = false;
  constructor(
    public ms: MainService,
    private notification: NzNotificationService
  ) {}

  open(): void {
    this.ms.isCollapsed = false;
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }

  ngOnInit() {
    this.notification.config({
      nzPlacement: "bottomRight"
    });

    this.subscriptions.push(
      this.ms.notificationEmitter.subscribe(n => {
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
