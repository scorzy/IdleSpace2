import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "./main.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NzGridModule,
  NzCardModule,
  NzFormModule,
  NzInputNumberModule,
  NzAlertModule,
  NzBadgeModule,
  NzButtonModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzIconModule,
  NzInputModule,
  NzLayoutModule,
  NzListModule,
  NzMenuModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,
  NzPageHeaderModule,
  NzPaginationModule,
  NzPopconfirmModule,
  NzPopoverModule,
  NzProgressModule,
  NzRadioModule,
  NzSelectModule,
  NzSliderModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzToolTipModule,
  NzTypographyModule,
  NzDrawerModule
} from "ng-zorro-antd";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
export const testImports = [
  RouterTestingModule,
  FormsModule,
  HttpClientModule,
  NzDrawerModule,
  BrowserAnimationsModule,
  NzGridModule,
  NzCardModule,
  DragDropModule,
  FlexLayoutModule,
  NzFormModule,
  ReactiveFormsModule,
  NzInputNumberModule,
  NzAlertModule,
  NzBadgeModule,
  NzButtonModule,
  NzCardModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzFormModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule,
  NzLayoutModule,
  NzListModule,
  NzMenuModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,
  NzPageHeaderModule,
  NzPaginationModule,
  NzPopconfirmModule,
  NzPopoverModule,
  NzProgressModule,
  NzRadioModule,
  NzSelectModule,
  NzSliderModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzToolTipModule,
  NzTypographyModule,
  NzDropDownModule
];

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: testImports,
      declarations: [AppComponent],
      providers: [MainService, OptionsService, FormatPipe]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
