import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EnemyDetailComponent } from "./enemy-detail.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { TimePipe } from "src/app/time.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Enemy } from "src/app/model/enemy/enemy";

describe("EnemyDetailComponent", () => {
  let component: EnemyDetailComponent;
  let fixture: ComponentFixture<EnemyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [EnemyDetailComponent, FormatPipe, TimePipe],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemyDetailComponent);
    component = fixture.componentInstance;
    const enemy = new Enemy();
    enemy.id = 100;
    component.ms.game.enemyManager.enemies.push(enemy);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
