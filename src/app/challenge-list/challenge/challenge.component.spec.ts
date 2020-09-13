import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of } from "rxjs";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { Game } from "src/app/model/game";
import { OptionsService } from "src/app/options.service";
import { SizePipe } from "src/app/size.pipe";
import { TimePipe } from "src/app/time.pipe";

import { ChallengeComponent } from "./challenge.component";

describe("ChallengeComponent", () => {
  let component: ChallengeComponent;
  let fixture: ComponentFixture<ChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [ChallengeComponent, FormatPipe, SizePipe],
      providers: [
        MainService,
        OptionsService,
        FormatPipe,
        TimePipe,
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: "0" })) }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeComponent);
    component = fixture.componentInstance;
    component.ms.game = new Game();
    component.challenge = component.ms.game.challengeManager.challenges[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
