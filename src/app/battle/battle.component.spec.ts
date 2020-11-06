import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { BattleComponent } from "./battle.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { SizePipe } from "../size.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { TimePipe } from "../time.pipe";

describe("BattleComponent", () => {
  let component: BattleComponent;
  let fixture: ComponentFixture<BattleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [BattleComponent, FormatPipe, SizePipe, TimePipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
