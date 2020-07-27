import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { Subscription } from "rxjs";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-save",
  templateUrl: "./save.component.html",
  styleUrls: ["./save.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveComponent implements OnInit, OnDestroy {
  exp = "";
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    public os: OptionsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.saveEmitter.subscribe((s: number) => this.cd.markForCheck()),
      this.ms.exportEmitter.subscribe((s: string) => {
        this.exp = s;
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  export() {
    this.ms.export();
  }
  import() {
    this.ms.decompressAndLoad(this.exp.trim());
  }
  download() {
    const myBlob = new Blob([this.exp], { type: "octet/stream" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(myBlob);
    link.setAttribute("download", "IdleSpace2.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
