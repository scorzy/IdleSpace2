import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { BiComponent } from "./bi.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Game } from "src/app/model/game";
import { TimePipe } from "src/app/time.pipe";

describe("BiComponent", () => {
  let component: BiComponent;
  let fixture: ComponentFixture<BiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [BiComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.unit = game.resourceManager.miner;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
