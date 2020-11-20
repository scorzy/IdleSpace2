import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";

@Component({
  selector: "app-design-detail",
  templateUrl: "./design-detail.component.html",
  styleUrls: ["./design-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignDetailComponent implements OnInit {
  @Input() data: ShipDesign;
  constructor() {}

  ngOnInit(): void {}
}
