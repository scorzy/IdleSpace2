import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { ModuleInfoComponent } from "./module-info.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { SizePipe } from "src/app/size.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Module } from "src/app/model/shipyard/module";
import { modules } from "src/app/model/data/modulesData";
import { Game } from "src/app/model/game";
import { TimePipe } from "src/app/time.pipe";

describe("ModuleInfoComponent", () => {
  let component: ModuleInfoComponent;
  let fixture: ComponentFixture<ModuleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [ModuleInfoComponent, FormatPipe, SizePipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleInfoComponent);
    component = fixture.componentInstance;
    // tslint:disable-next-line
    const game = new Game();
    component.mod = new Module();
    component.mod.init(modules[0]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
