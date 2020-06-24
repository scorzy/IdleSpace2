import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ModComponent } from "./mod.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Game } from "src/app/model/game";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of } from "rxjs";
import { TimePipe } from "src/app/time.pipe";

describe("ModComponent", () => {
  let component: ModComponent;
  let fixture: ComponentFixture<ModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [ModComponent, FormatPipe],
      providers: [
        MainService,
        OptionsService,
        FormatPipe,
        TimePipe,
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: "m" })) }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModComponent);
    component = fixture.componentInstance;
    const game = new Game();
    component.ms.game = game;
    // component.unit = game.resourceManager.miner;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
