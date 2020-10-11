import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { TimePipe } from "src/app/time.pipe";

import { ShopComponent } from "./shop.component";

describe("ShopComponent", () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [ShopComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    component.prestiges = component.ms.game.prestigeManager.tabs[0].prestige;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
