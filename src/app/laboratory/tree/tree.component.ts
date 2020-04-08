import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
declare let vis: any;

@Component({
  selector: "app-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("techTree", { static: true })
  private techTree: ElementRef<any>;
  @ViewChild("myPopover", { static: true })
  private myPopover: ElementRef<any>;
  public top = 0;
  public left = 0;
  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.ms.innerContent = false;
  }
  ngOnDestroy() {
    this.ms.innerContent = true;
  }
  ngAfterViewInit(): void {
    setTimeout(this.makeVis.bind(this), 0);
  }
  makeVis(): void {
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);

    let doneColor = "";
    let toDoColor = "";
    let notAvailableColor = "";
    if (OptionsService.isDark) {
      doneColor = "#52c41a";
      toDoColor = "#bfbfbf";
      notAvailableColor = "#40a9ff";
    } else {
      doneColor = "#52c41a";
      toDoColor = "#bfbfbf";
      notAvailableColor = "#40a9ff";
    }
    this.ms.game.researchManager.researches.forEach((res) => {
      res.available = false;
    });
    this.ms.game.researchManager.researches[0].setAvailability();
    this.ms.game.researchManager.researches.forEach((res) => {
      nodes.add([
        {
          id: res.visId,
          label: res.name,
          level: res.visLevel,
          color:
            res.level > 0
              ? doneColor
              : res.available
              ? notAvailableColor
              : toDoColor
        }
      ]);
      if (res.researchToUnlock) {
        res.researchToUnlock.forEach((unl) => {
          edges.add([
            {
              from: res.visId,
              to: unl.visId
            }
          ]);
        });
      }
    });

    // create a network
    const container = document.getElementById("techTree");
    const x = -container.clientWidth / 2 + 50;
    const y = -container.clientHeight / 2 + 50;
    const step = 10;
    nodes.add({
      id: 10000,
      x,
      y,
      label: "Done",
      color: doneColor,
      value: 1,
      level: 0,
      fixed: true,
      physics: false
    });
    nodes.add({
      id: 10001,
      x,
      y,
      label: "Available",
      color: notAvailableColor,
      value: 1,
      level: 1,
      fixed: true,
      physics: false
    });
    nodes.add({
      id: 10002,
      x,
      y,
      label: "Not Available",
      color: toDoColor,
      value: 1,
      level: 2,
      fixed: true,
      physics: false
    });
    edges.add({ from: 10000, to: 10001 });
    edges.add({ from: 10001, to: 10002 });

    const data = {
      nodes,
      edges
    };
    const options = {
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
    // tslint:disable-next-line
    const network = new vis.Network(container, data, options);

    // network.on("click", (properties) => {
    //   var nodeID = properties.nodes[0];
    //   if (nodeID) {
    //     var clickX =
    //       properties.pointer.DOM.x + this.techTree.nativeElement.offsetLeft;
    //     var clickY =
    //       properties.pointer.DOM.y + this.techTree.nativeElement.offsetTop;
    //     this.top = clickY;
    //     this.left = clickX;
    //     console.log(this.top + " " + this.left);
    //     // this.myPopover.nativeElement.style.top = clickX;
    //     // this.myPopover.nativeElement.style.left = clickY;
    //     // this.myPopover.nativeElement.click();

    //     this.cd.markForCheck();
    //   }
    // });
  }
}
