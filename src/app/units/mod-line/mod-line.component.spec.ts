import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ModLineComponent } from "./mod-line.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Game } from "src/app/model/game";
import { TimePipe } from "src/app/time.pipe";

describe("ModLineComponent", () => {
  let component: ModLineComponent;
  let fixture: ComponentFixture<ModLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [ModLineComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModLineComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.mod = game.resourceManager.miner.modStack.prodMultiMod;
    component.unit = game.resourceManager.miner;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
