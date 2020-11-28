import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { Spell } from "../model/computing/spell";
import { fadeIn } from "../animations";

@Component({
  selector: "app-spells",
  templateUrl: "./spells.component.html",
  styleUrls: ["./spells.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class SpellsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  valueNo = 0;
  value1 = 1;
  value2 = 2;
  value3 = 3;
  spellList: Spell[];
  ngOnInit() {
    super.ngOnInit();
    this.setList();
  }
  getSpellId(index: number, spell: Spell): string {
    return spell.id;
  }
  setList() {
    this.spellList = this.ms.game.computingManager.showAll
      ? this.ms.game.computingManager.spells
      : this.ms.game.computingManager.currentSpells;
  }
}
