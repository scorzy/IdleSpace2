import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { SubTableComponent } from "./sub-table.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { Unit } from "src/app/model/units/unit";
import { UNITS } from "src/app/model/data/units";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("SubTableComponent", () => {
  let component: SubTableComponent;
  let fixture: ComponentFixture<SubTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [SubTableComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTableComponent);
    component = fixture.componentInstance;
    component.unit = new Unit(UNITS[0]);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
