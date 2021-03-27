import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

import { BuyMenuComponent } from "./buy-menu.component";

describe("BuyMenuComponent", () => {
  let component: BuyMenuComponent;
  let fixture: ComponentFixture<BuyMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [BuyMenuComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(BuyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
