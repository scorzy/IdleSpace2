import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { UnitDetailComponent } from "./unit-detail.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("UnitDetailComponent", () => {
  let component: UnitDetailComponent;
  let fixture: ComponentFixture<UnitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [UnitDetailComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDetailComponent);
    component = fixture.componentInstance;
    component.unit = component.ms.game.resourceManager.units[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
