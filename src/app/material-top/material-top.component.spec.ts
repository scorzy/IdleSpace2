import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MaterialTopComponent } from "./material-top.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";

describe("MaterialTopComponent", () => {
  let component: MaterialTopComponent;
  let fixture: ComponentFixture<MaterialTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
      declarations: [MaterialTopComponent],
      providers: [MainService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
