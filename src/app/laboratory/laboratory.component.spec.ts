import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { LaboratoryComponent } from "./laboratory.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { TimePipe } from "../time.pipe";

describe("LaboratoryComponent", () => {
  let component: LaboratoryComponent;
  let fixture: ComponentFixture<LaboratoryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [LaboratoryComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(LaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
