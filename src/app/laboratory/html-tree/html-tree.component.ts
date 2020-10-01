import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-html-tree",
  templateUrl: "./html-tree.component.html",
  styleUrls: ["./html-tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtmlTreeComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  ngOnInit(): void {}
}
