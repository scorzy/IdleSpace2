import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { TreeNodeComponent } from "./tree-node.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Game } from "src/app/model/game";
import { TimePipe } from "src/app/time.pipe";

describe("TreeNodeComponent", () => {
  let component: TreeNodeComponent;
  let fixture: ComponentFixture<TreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [TreeNodeComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.research = game.researchManager.researches[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
