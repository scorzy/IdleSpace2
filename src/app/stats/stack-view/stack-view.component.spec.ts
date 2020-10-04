import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { BonusStack } from "src/app/model/bonus/bonusStack";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

import { StackViewComponent } from "./stack-view.component";

describe("StackViewComponent", () => {
  let component: StackViewComponent;
  let fixture: ComponentFixture<StackViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [StackViewComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackViewComponent);
    component = fixture.componentInstance;
    component.bonusStack = new BonusStack();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
