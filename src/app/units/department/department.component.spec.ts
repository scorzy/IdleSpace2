import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from "@angular/core/testing";
import { DepartmentComponent } from "./department.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { testImports } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of } from "rxjs";
import { TimePipe } from "src/app/time.pipe";

describe("DepartmentComponent", () => {
  let component: DepartmentComponent;
  let fixture: ComponentFixture<DepartmentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [DepartmentComponent, FormatPipe],
        providers: [
          MainService,
          OptionsService,
          FormatPipe,
          TimePipe,
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(convertToParamMap({ id: "1" })) }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
