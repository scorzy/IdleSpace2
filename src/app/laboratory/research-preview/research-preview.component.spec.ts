import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";
import { ResearchPreviewComponent } from "./research-preview.component";
import { MainService } from "src/app/main.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { TimePipe } from "src/app/time.pipe";
import { OptionsService } from "src/app/options.service";
import { Game } from "src/app/model/game";

describe("ResearchPreviewComponent", () => {
  let component: ResearchPreviewComponent;
  let fixture: ComponentFixture<ResearchPreviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [ResearchPreviewComponent, FormatPipe, TimePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchPreviewComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.research = game.researchManager.researches[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
