import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent implements OnInit {
  @Input() progress = 0;
  constructor() {}
  ngOnInit() {}
}
