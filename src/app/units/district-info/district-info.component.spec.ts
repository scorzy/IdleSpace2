import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DistrictInfoComponent } from "./district-info.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";
import { Game } from "src/app/model/game";

describe("DistrictInfoComponent", () => {
  let component: DistrictInfoComponent;
  let fixture: ComponentFixture<DistrictInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [DistrictInfoComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictInfoComponent);
    const game = new Game();
    component = fixture.componentInstance;
    component.district = game.resourceManager.habitableSpace;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
