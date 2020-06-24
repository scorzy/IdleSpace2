import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { JobComponent } from "./job.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { MainService } from "../main.service";
import { FormatPipe } from "../format.pipe";
import { TimePipe } from "../time.pipe";
import { Game } from "../model/game";
import { OptionsService } from "../options.service";

describe("JobComponent", () => {
  let component: JobComponent;
  let fixture: ComponentFixture<JobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [JobComponent, FormatPipe, TimePipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobComponent);
    component = fixture.componentInstance;
    component.ms.game = new Game();
    component.job = component.ms.game.researchManager.researches[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
