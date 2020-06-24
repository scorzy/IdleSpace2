import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SpaceStationsComponent } from "./space-stations.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { Game } from "../model/game";
import { TimePipe } from "../time.pipe";

describe("SpaceStationsComponent", () => {
  let component: SpaceStationsComponent;
  let fixture: ComponentFixture<SpaceStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [SpaceStationsComponent, FormatPipe],
      providers: [MainService, OptionsService, FormatPipe, TimePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceStationsComponent);
    component = fixture.componentInstance;
    component.ms.game = new Game();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
