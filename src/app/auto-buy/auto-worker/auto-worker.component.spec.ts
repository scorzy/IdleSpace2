import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { AutoWorkerComponent } from "./auto-worker.component";
import { Game } from "src/app/model/game";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

describe("AutoWorkerComponent", () => {
  let component: AutoWorkerComponent;
  let fixture: ComponentFixture<AutoWorkerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: testImports,
        declarations: [AutoWorkerComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoWorkerComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.autoWorker = game.resourceManager.workers[0].autoBuyer;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
