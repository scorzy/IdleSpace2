import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-notification-list",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {}
