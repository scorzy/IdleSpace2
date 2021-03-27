import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
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
  @Input() integer = false;
  @Input() digits = 6;
  additiveBonuses: { name: string; factor: Decimal; typeIcon: string }[];
  bonuses: { name: string; factor: Decimal; typeIcon: string }[];
  total = ZERO;

  constructor() {}

  ngOnInit(): void {
    if (this.additiveStack) {
      this.additiveBonuses = this.additiveStack.bonuses
        .filter((bon) => !bon.getBonus().eq(1))
        .map((bon) => ({
          name: bon.unit.name,
          factor: bon.getAdditiveBonus(),
          typeIcon: bon.unit.typeIcon
        }));
    }

    if (this.bonusStack) {
      this.bonuses = this.bonusStack.bonuses
        .filter((bon) => !bon.getBonus().eq(1))
        .map((bon) => ({
          name: bon.unit.name,
          factor: bon.getBonus().times(100).minus(100),
          typeIcon: bon.unit.typeIcon
        }));
    }

    this.total = (this.additiveStack
      ? this.additiveStack.totalAdditiveBonus
      : ONE
    ).times(this.bonusStack ? this.bonusStack.totalBonus : ONE);
  }
}
