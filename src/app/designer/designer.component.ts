import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-designer",
  templateUrl: "./designer.component.html",
  styleUrls: ["./designer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignerComponent implements OnInit {
  collapsed = false;

  constructor() {}

  ngOnInit() {}
}
