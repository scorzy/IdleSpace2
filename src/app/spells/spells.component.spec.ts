import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { SpellsComponent } from "./spells.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { TimePipe } from "../time.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";

describe("SpellsComponent", () => {
  let component: SpellsComponent;
  let fixture: ComponentFixture<SpellsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [SpellsComponent, FormatPipe, TimePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
