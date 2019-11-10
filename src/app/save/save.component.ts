import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-save",
  templateUrl: "./save.component.html",
  styleUrls: ["./save.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit() {}
}
