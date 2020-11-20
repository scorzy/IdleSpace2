import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { SizePipe } from "../size.pipe";
import { TimePipe } from "../time.pipe";

import { DesignDetailComponent } from "./design-detail.component";

describe("DesignDetailComponent", () => {
  let component: DesignDetailComponent;
  let fixture: ComponentFixture<DesignDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [DesignDetailComponent, FormatPipe, SizePipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
