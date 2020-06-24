import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { Spell } from "../model/computing/spell";

@Component({
  selector: "app-spell-bar",
  templateUrl: "./spell-bar.component.html",
  styleUrls: ["./spell-bar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpellBarComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  getSpellId(index: number, spell: Spell) {
    return spell.id;
  }
}
