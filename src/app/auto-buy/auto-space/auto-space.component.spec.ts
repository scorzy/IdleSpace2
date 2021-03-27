import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AutoSpaceComponent } from "./auto-space.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoSpaceComponent", () => {
  let component: AutoSpaceComponent;
  let fixture: ComponentFixture<AutoSpaceComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: testImports,
        declarations: [AutoSpaceComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(AutoSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
