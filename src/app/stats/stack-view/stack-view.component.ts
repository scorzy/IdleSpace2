import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { BonusStack } from "src/app/model/bonus/bonusStack";

@Component({
  selector: "app-stack-view",
  templateUrl: "./stack-view.component.html",
  styleUrls: ["./stack-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackViewComponent implements OnInit {
  @Input() bonusStack: BonusStack;
  @Input() title = "";
  bonuses: { name: string; factor: Decimal }[];
  constructor() {}

  ngOnInit(): void {
    this.bonuses = this.bonusStack.bonuses
      .filter((bon) => !bon.getBonus().eq(1))
      .map((bon) => {
        console.log(bon.getBonus().toNumber());
        return { name: bon.unit.name, factor: bon.getBonus() };
      });
  }
}
