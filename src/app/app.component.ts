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
import { ShipDesign } from "./model/shipyard/shipDesign";
import { OptionsService } from "./options.service";
import { fadeIn } from "./animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [fadeIn]
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
    public os: OptionsService,
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
