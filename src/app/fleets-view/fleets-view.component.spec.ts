import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { FleetsViewComponent } from "./fleets-view.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { TimePipe } from "../time.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";

describe("FleetsViewComponent", () => {
  let component: FleetsViewComponent;
  let fixture: ComponentFixture<FleetsViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [FleetsViewComponent, FormatPipe, TimePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
