import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PrestigeCardComponent } from "./prestige-card.component";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { SizePipe } from "src/app/size.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";
import { Game } from "src/app/model/game";

describe("PrestigeCardComponent", () => {
  let component: PrestigeCardComponent;
  let fixture: ComponentFixture<PrestigeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: testImports,
      declarations: [PrestigeCardComponent, FormatPipe, SizePipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestigeCardComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.card = game.prestigeManager.cards[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
