import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ShipsViewComponent } from "./ships-view.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { SizePipe } from "../size.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { ShipDesign } from "../model/shipyard/shipDesign";

describe("ShipsViewComponent", () => {
  let component: ShipsViewComponent;
  let fixture: ComponentFixture<ShipsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [ShipsViewComponent, FormatPipe, SizePipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipsViewComponent);
    component = fixture.componentInstance;
    component.designs = [new ShipDesign()];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
