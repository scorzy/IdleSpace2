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
const createNodeBox: any = (
  group,
  config,
  width,
  height,
  isRoot,
  research: Research
) => {
  /* Outermost large rectangle */
  const container = group.addShape("rect", {
    attrs: {
      x: 0,
      y: 0,
      width,
      height
    }
  });
  if (!isRoot) {
    /* Little dot on the left     */
    group.addShape("circle", {
      attrs: {
        x: 3,
        y: height / 2,
        r: 6,
        fill: config.basicColor
      }
    });
  }
  /* rectangle */
  group.addShape("rect", {
    attrs: {
      x: 3,
      y: 0,
      width: width,
      height,
      fill: config.bgColor,
      stroke: config.borderColor,
      radius: 2,
      cursor: "pointer"
    }
  });

  /* Thick line on the left */
  group.addShape("rect", {
    attrs: {
      x: 3,
      y: 0,
      width: 3,
      height,
      fill: config.basicColor,
      radius: 1.5
    }
  });

  /* name */
  group.addShape("text", {
    attrs: {
      text: research.name,
      x: 19,
      y: 19,
      fontSize: 14,
      fontWeight: 700,
      textAlign: "left",
      textBaseline: "middle",
      fill: config.fontColor,
      cursor: "pointer"
    }
  });

  return container;
};

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
        drawShape: function drawShape(cfg, group) {
          const config = colorConfig;
          const isRoot = cfg.type === "root";
          const container = createNodeBox(
            group,
            config,
            243,
            64,
            isRoot,
            cfg.research
          );

          return container;
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
