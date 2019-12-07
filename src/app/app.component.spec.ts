import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "./main.service";
import { FormsModule } from "@angular/forms";
import { IconsProviderModule } from "./iconModule/icons-provider.module";
import { NgZorroAntdModule, NzGridModule, NzCardModule } from "ng-zorro-antd";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FlexLayoutModule } from "@angular/flex-layout";

export const testImports = [
  RouterTestingModule,
  IconsProviderModule,
  NgZorroAntdModule,
  FormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  NzGridModule,
  NzCardModule,
  DragDropModule,
  FlexLayoutModule
];

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [AppComponent],
      providers: [MainService]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
