import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-auto-attack-options",
  templateUrl: "./auto-attack-options.component.html",
  styleUrls: ["./auto-attack-options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoAttackOptionsComponent implements OnInit {
  constructor(public ms: MainService) {}
  ngOnInit(): void {}
}
