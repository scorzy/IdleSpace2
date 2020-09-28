import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { PrestigeComponent } from "./prestige.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { TimePipe } from "../time.pipe";

describe("PrestigeComponent", () => {
  let component: PrestigeComponent;
  let fixture: ComponentFixture<PrestigeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [PrestigeComponent, FormatPipe, TimePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
