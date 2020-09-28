import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { AutoRefreshComponent } from "./auto-refresh.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoRefreshComponent", () => {
  let component: AutoRefreshComponent;
  let fixture: ComponentFixture<AutoRefreshComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: testImports,
        declarations: [AutoRefreshComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
