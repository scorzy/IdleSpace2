import { ComponentFixture, TestBed } from "@angular/core/testing";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

import { AutoWarpComponent } from "./auto-warp.component";

describe("AutoWarpComponent", () => {
  let component: AutoWarpComponent;
  let fixture: ComponentFixture<AutoWarpComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: testImports,
      declarations: [AutoWarpComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(AutoWarpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
