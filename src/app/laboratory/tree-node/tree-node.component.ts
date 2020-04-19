import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Research } from "src/app/model/researches/research";

@Component({
  selector: "app-tree-node",
  templateUrl: "./tree-node.component.html",
  styleUrls: ["./tree-node.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeNodeComponent implements OnInit {
  @Input() research: Research;
  constructor() {}

  ngOnInit(): void {}
  getResId(index: number, res: Research) {
    return res.id;
  }
}
