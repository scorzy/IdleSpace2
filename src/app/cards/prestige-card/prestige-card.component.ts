import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { PrestigeCard } from "src/app/model/prestige/prestigeCard";

@Component({
  selector: "app-prestige-card",
  templateUrl: "./prestige-card.component.html",
  styleUrls: ["./prestige-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeCardComponent implements OnInit {
  @Input() card: PrestigeCard;
  constructor() {}

  ngOnInit(): void {}
}
