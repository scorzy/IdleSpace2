import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { BattleTableComponent } from "./battle-table.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { SizePipe } from "src/app/size.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Enemy } from "src/app/model/enemy/enemy";
import { SearchJob } from "src/app/model/enemy/searchJob";
import { TimePipe } from "src/app/time.pipe";

describe("BattleTableComponent", () => {
  let component: BattleTableComponent;
  let fixture: ComponentFixture<BattleTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [BattleTableComponent, FormatPipe, SizePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleTableComponent);
    component = fixture.componentInstance;
    component.ms.game.enemyManager.currentEnemy = new Enemy();
    component.ms.game.enemyManager.currentEnemy.generate(new SearchJob());
    component.ms.game.enemyManager.currentEnemy.generateCells();
    component.currentEnemy = component.ms.game.enemyManager.currentEnemy;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
