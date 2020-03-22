import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UnitCardComponent } from "./unit-card.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("UnitCardComponent", () => {
  let component: UnitCardComponent;
  let fixture: ComponentFixture<UnitCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [UnitCardComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCardComponent);
    component = fixture.componentInstance;
    component.unit = component.ms.game.resourceManager.miner;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
