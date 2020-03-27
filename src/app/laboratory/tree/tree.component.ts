import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterContentInit,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { MainService } from "src/app/main.service";
declare let vis: any;

@Component({
  selector: "app-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild("techTree") techTree;
  constructor(public ms: MainService) {}

  ngOnInit(): void {
    this.ms.innerContent = false;
  }
  ngOnDestroy() {
    this.ms.innerContent = true;
  }
  ngAfterContentInit(): void {
    setTimeout(this.makeVis.bind(this), 0);
  }
  makeVis(): void {
    let i = 0;
    var nodes = new vis.DataSet([]);
    var edges = new vis.DataSet([]);

    this.ms.game.researchManager.researches.forEach(res => {
      nodes.add([{ id: res.visId, label: res.name, level: res.visLevel }]);
      if (res.researchToUnlock)
        res.researchToUnlock.forEach(unl => {
          edges.add([{ from: res.visId, to: unl.visId }]);
        });
    });

    // create a network
    var container = document.getElementById("techTree");
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout: {
        hierarchical: {
          direction: "LR"
        }
      },
      nodes: {
        shape: "box"
      },
      edges: {
        smooth: {
          enabled: true,
          type: "dynamic",
          roundness: 0.3
        }
      },
      physics: false,
      interaction: {
        navigationButtons: true,
        keyboard: true,
        dragNodes: false
      }
    };
    var network = new vis.Network(container, data, options);

    // layout: {
    //   hierarchical: {
    //     // direction: "LR"
    //   }
    // }
  }
}
