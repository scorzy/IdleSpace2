import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { AutoMegaComponent } from "./auto-mega.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoMegaComponent", () => {
  let component: AutoMegaComponent;
  let fixture: ComponentFixture<AutoMegaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AutoMegaComponent, FormatPipe],
        imports: testImports,
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoMegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
