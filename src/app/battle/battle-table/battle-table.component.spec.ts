import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BattleTableComponent } from "./battle-table.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { SizePipe } from "src/app/size.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Enemy } from "src/app/model/enemy/enemy";
import { SearchJob } from "src/app/model/enemy/searchJob";

describe("BattleTableComponent", () => {
  let component: BattleTableComponent;
  let fixture: ComponentFixture<BattleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [BattleTableComponent, FormatPipe, SizePipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleTableComponent);
    component = fixture.componentInstance;
    component.ms.game.enemyManager.currentEnemy = new Enemy();
    component.ms.game.enemyManager.currentEnemy.generate(new SearchJob());
    component.ms.game.enemyManager.currentEnemy.generateCells();
    component.currentEnemy = new Enemy();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
