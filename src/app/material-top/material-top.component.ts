import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  TemplateRef
} from "@angular/core";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";
import { Subscription } from "rxjs";
import { fadeIn } from "../animations";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-material-top",
  templateUrl: "./material-top.component.html",
  styleUrls: ["./material-top.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class MaterialTopComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  tplModal: NzModalRef;
  popoverTrigger: string = null;

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private modalService: NzModalService,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.popoverTrigger = "hover";
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.breakpointObserver
        .observe(["(min-width: 959px)"])
        .subscribe((state: BreakpointState) => {
          this.popoverTrigger = state.matches ? "hover" : "null";
        })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getId(index: number, mat: Unit) {
    return mat.id;
  }

  createModal(
    title: string,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ): void {
    this.tplModal = this.modalService.create({
      nzTitle: title,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true
    });
  }
  destroyTplModal() {
    this.tplModal.destroy();
  }
}
