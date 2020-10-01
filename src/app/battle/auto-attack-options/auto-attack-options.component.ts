import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-auto-attack-options",
  templateUrl: "./auto-attack-options.component.html",
  styleUrls: ["./auto-attack-options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoAttackOptionsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {}
