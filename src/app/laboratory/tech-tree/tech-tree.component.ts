import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import G6 from "@antv/g6";
import { MainService } from "src/app/main.service";
import { Research } from "src/app/model/researches/research";
import { OptionsService } from "src/app/options.service";

const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["L", x - r + 2 * r - 4, y]
  ];
};
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["L", x - r + 2 * r - 4, y],
    ["M", x - r + r, y - r + 4],
    ["L", x, y + r - 4]
  ];
};
const TREE_NODE = "tree-node";

@Component({
  selector: "app-tech-tree",
  templateUrl: "./tech-tree.component.html",
  styleUrls: ["./tech-tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechTreeComponent implements OnInit, AfterViewInit {
  @ViewChild("mountNode", { static: false }) mountNode: ElementRef;

  constructor(public ms: MainService, public os: OptionsService) {}

  lightColors = {
    basicColor: "#722ED1",
    fontColor: "#722ED1",
    borderColor: "#722ED1",
    bgColor: "#F6EDFC"
  };
  darkColors = {
    basicColor: "#F6EDFC",
    fontColor: "#F6EDFC",
    borderColor: "#F6EDFC",
    bgColor: "#2D2C2A"
  };

  ngOnInit() {}
  ngAfterViewInit() {
    const colorConfig = this.os.isDark ? this.darkColors : this.lightColors;
    G6.registerNode(
      TREE_NODE,
      {
        draw(cfg, group) {
          const research: Research = cfg.research;

          const html = G6.Util.createDom(
            '<div class="bordered light-background" style="padding:10px;"><h2>' +
              research.name +
              "</h2><p class='description'>" +
              research.description +
              "</p></div>"
          );
          return group.addShape("dom", {
            attrs: {
              x: 0,
              y: 0,
              width: 250,
              height: 100,
              html
            }
          });
        }
      },
      "single-shape"
    );

    const width = this.mountNode.nativeElement.offsetWidth;
    const elements = document.getElementsByTagName(
      "nz-content"
    ) as HTMLCollectionOf<HTMLElement>;
    const height = elements[0].offsetHeight;

    const treeGraph = new G6.TreeGraph({
      renderer: "svg",
      container: "mountNode",
      width: width,
      height: height,
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange(item, collapsed) {
              const icon = item.get("group").findByClassName("collapse-icon");
              if (collapsed) {
                icon.attr("symbol", EXPAND_ICON);
              } else {
                icon.attr("symbol", COLLAPSE_ICON);
              }
            }
          },
          "drag-canvas",
          "zoom-canvas"
        ]
      },
      defaultNode: {
        shape: TREE_NODE,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5]
        ]
      },
      defaultEdge: {
        shape: "cubic-horizontal",
        style: {
          stroke: "#A3B1BF"
        }
      },
      layout: {
        type: "mindmap",
        direction: "H",
        getHeight: () => {
          return 70;
        },
        getWidth: () => {
          return 16;
        },
        getVGap: () => {
          return 20;
        },
        getHGap: () => {
          return 150;
        },
        getSide: () => {
          return "right";
        }
      }
    });

    treeGraph.data(this.ms.game.researchManager.treeData);
    treeGraph.render();
    treeGraph.fitView();
  }
}
