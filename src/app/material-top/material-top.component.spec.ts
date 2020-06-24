import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MaterialTopComponent } from "./material-top.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { OptionsService } from "../options.service";
import { TimePipe } from "../time.pipe";

describe("MaterialTopComponent", () => {
  let component: MaterialTopComponent;
  let fixture: ComponentFixture<MaterialTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [MaterialTopComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
