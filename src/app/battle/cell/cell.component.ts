import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Input
} from "@angular/core";
import { Cell } from "src/app/model/enemy/cell";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() cell: Cell;
  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
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
}
