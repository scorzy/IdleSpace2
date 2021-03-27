import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { testImports } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { SizePipe } from "../size.pipe";
import { TimePipe } from "../time.pipe";

import { ChallengeListComponent } from "./challenge-list.component";

describe("ChallengeListComponent", () => {
  let component: ChallengeListComponent;
  let fixture: ComponentFixture<ChallengeListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [ChallengeListComponent, FormatPipe, SizePipe],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(ChallengeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
