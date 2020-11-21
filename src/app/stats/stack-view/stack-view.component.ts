import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { BonusStack } from "src/app/model/bonus/bonusStack";
import { ZERO, ONE } from "src/app/model/CONSTANTS";

@Component({
  selector: "app-stack-view",
  templateUrl: "./stack-view.component.html",
  styleUrls: ["./stack-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackViewComponent implements OnInit {
  @Input() additiveStack: BonusStack;
  @Input() bonusStack: BonusStack;
  @Input() title = "";
  additiveBonuses: { name: string; factor: Decimal }[];
  bonuses: { name: string; factor: Decimal }[];
  total = ZERO;
  constructor() {}

  ngOnInit(): void {
    if (this.additiveStack) {
      this.additiveBonuses = this.additiveStack.bonuses
        .filter((bon) => !bon.getBonus().eq(1))
        .map((bon) => {
          return { name: bon.unit.name, factor: bon.getAdditiveBonus() };
        });
    }

    if (this.bonusStack) {
      this.bonuses = this.bonusStack.bonuses
        .filter((bon) => !bon.getBonus().eq(1))
        .map((bon) => {
          return { name: bon.unit.name, factor: bon.getBonus() };
        });
    }

    this.total = (this.additiveStack
      ? this.additiveStack.totalAdditiveBonus
      : ONE
    ).times(this.bonusStack ? this.bonusStack.totalBonus : ONE);
  }
}
