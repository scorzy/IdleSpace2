import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Research } from "src/app/model/researches/research";

@Component({
  selector: "app-research-preview",
  templateUrl: "./research-preview.component.html",
  styleUrls: ["./research-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchPreviewComponent implements OnInit {
  @Input() research: Research;
  @Input() noProgress = false;
  constructor() {}
  ngOnInit(): void {}

  getId(index: number, aaa: any) {
    return "id" in aaa ? aaa.id : index;
  }
}
