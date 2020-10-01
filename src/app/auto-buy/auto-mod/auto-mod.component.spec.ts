import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AutoModComponent } from "./auto-mod.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoModComponent", () => {
  let component: AutoModComponent;
  let fixture: ComponentFixture<AutoModComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: testImports,
        declarations: [AutoModComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoModComponent);
    component = fixture.componentInstance;
    component.autoMod = component.ms.game.resourceManager.workers[0].autoMod;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
