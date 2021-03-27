import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { UnitsComponent } from "./units.component";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { OptionsService } from "../options.service";
import { TimePipe } from "../time.pipe";

describe("UnitsComponent", () => {
  let component: UnitsComponent;
  let fixture: ComponentFixture<UnitsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [UnitsComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(UnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
