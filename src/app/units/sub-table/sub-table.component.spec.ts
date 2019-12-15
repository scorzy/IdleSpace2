import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SubTableComponent } from "./sub-table.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { Unit } from "src/app/model/units/unit";
import { UNITS } from "src/app/model/data/units";
import { Production } from "src/app/model/units/production";
import { OptionsService } from "src/app/options.service";

describe("SubTableComponent", () => {
  let component: SubTableComponent;
  let fixture: ComponentFixture<SubTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [SubTableComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTableComponent);
    component = fixture.componentInstance;
    component.unit = new Unit(UNITS[0]);
    component.data = new Production(component.unit, component.unit);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
