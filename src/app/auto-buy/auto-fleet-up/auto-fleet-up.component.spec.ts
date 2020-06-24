import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutoFleetUpComponent } from "./auto-fleet-up.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoFleetUpComponent", () => {
  let component: AutoFleetUpComponent;
  let fixture: ComponentFixture<AutoFleetUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: testImports,
      declarations: [AutoFleetUpComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoFleetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
