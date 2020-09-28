import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";
import { ProdInfoComponent } from "./prod-info.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { Unit } from "src/app/model/units/unit";
import { UNITS } from "src/app/model/data/units";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("ProdInfoComponent", () => {
  let component: ProdInfoComponent;
  let fixture: ComponentFixture<ProdInfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [ProdInfoComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdInfoComponent);
    component = fixture.componentInstance;
    component.unit = new Unit(UNITS[0]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
