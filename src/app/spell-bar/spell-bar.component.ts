import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { Spell } from "../model/computing/spell";
import { DomSanitizer } from "@angular/platform-browser";
import { MainService } from "../main.service";

@Component({
  selector: "app-spell-bar",
  templateUrl: "./spell-bar.component.html",
  styleUrls: ["./spell-bar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpellBarComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  valueNo = 0;
  value1 = 1;
  value2 = 2;
  value3 = 3;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    super(ms, cd);
  }
  getSpellId(index: number, spell: Spell) {
    return spell.id;
  }
  public clip(spell) {
    return this.sanitizer.bypassSecurityTrustStyle(
      "inset(" + spell.percent + "% 0px 0px"
    );
  }
}
