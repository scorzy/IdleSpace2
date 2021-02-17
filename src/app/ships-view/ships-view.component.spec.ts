import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ShipsViewComponent } from "./ships-view.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { SizePipe } from "../size.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { TimePipe } from "../time.pipe";

describe("ShipsViewComponent", () => {
  let component: ShipsViewComponent;
  let fixture: ComponentFixture<ShipsViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [ShipsViewComponent, FormatPipe, SizePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(ShipsViewComponent);
    component = fixture.componentInstance;
    component.designs = [new ShipDesign()];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
