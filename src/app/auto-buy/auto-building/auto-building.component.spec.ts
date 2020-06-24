import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutoBuildingComponent } from "./auto-building.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Game } from "src/app/model/game";
import { TimePipe } from "src/app/time.pipe";

describe("AutoBuildingComponent", () => {
  let component: AutoBuildingComponent;
  let fixture: ComponentFixture<AutoBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [AutoBuildingComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoBuildingComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.autoBuilding = game.resourceManager.buildings[0].autoBuyer;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
