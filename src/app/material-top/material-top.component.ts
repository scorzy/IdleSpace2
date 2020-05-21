import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  TemplateRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";
import { fadeIn } from "../animations";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { BreakpointObserver } from "@angular/cdk/layout";
import { OptionsService } from "../options.service";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-material-top",
  templateUrl: "./material-top.component.html",
  styleUrls: ["./material-top.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class MaterialTopComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  tplModal: NzModalRef;
  popoverTrigger: string = null;
  Decimal = Decimal;

  constructor(
    ms: MainService,
    public os: OptionsService,
    cd: ChangeDetectorRef,
    private modalService: NzModalService,
    public breakpointObserver: BreakpointObserver
  ) {
    super(ms, cd);
  }

  ngOnInit() {
    this.popoverTrigger = "hover";
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
      // ,
      // this.breakpointObserver
      //   .observe(["(min-width: 959px)"])
      //   .subscribe((state: BreakpointState) => {
      //     this.popoverTrigger = state.matches ? "hover" : "null";
      //   })
    );
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
