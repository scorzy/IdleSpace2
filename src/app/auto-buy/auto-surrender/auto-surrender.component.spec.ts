import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { AutoSurrenderComponent } from "./auto-surrender.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoSurrenderComponent", () => {
  let component: AutoSurrenderComponent;
  let fixture: ComponentFixture<AutoSurrenderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: testImports,
        declarations: [AutoSurrenderComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSurrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
