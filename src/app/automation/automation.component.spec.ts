import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutomationComponent } from "./automation.component";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";

describe("AutomationComponent", () => {
  let component: AutomationComponent;
  let fixture: ComponentFixture<AutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: testImports,
      declarations: [AutomationComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
