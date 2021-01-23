import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";

import { PricesComponent } from "./prices.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { Game } from "../model/game";
import { TimePipe } from "../time.pipe";

describe("PricesComponent", () => {
  let component: PricesComponent;
  let fixture: ComponentFixture<PricesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [PricesComponent, FormatPipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesComponent);
    component = fixture.componentInstance;
    component.ms.game = new Game();
    component.unit = component.ms.game.resourceManager.miner;
    component.quantity = new Decimal(5);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
