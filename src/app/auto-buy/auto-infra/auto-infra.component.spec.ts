import { ComponentFixture, TestBed } from "@angular/core/testing";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

import { AutoInfraComponent } from "./auto-infra.component";

describe("AutoInfraComponent", () => {
  let component: AutoInfraComponent;
  let fixture: ComponentFixture<AutoInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: testImports,
      declarations: [AutoInfraComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
