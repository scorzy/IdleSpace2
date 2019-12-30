import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DesignInfoComponent } from "./design-info.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { SizePipe } from "../size.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { ShipDesign } from "../model/shipyard/shipDesign";

describe("DesignInfoComponent", () => {
  let component: DesignInfoComponent;
  let fixture: ComponentFixture<DesignInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [DesignInfoComponent, FormatPipe, SizePipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignInfoComponent);
    component = fixture.componentInstance;
    component.original = new ShipDesign();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
