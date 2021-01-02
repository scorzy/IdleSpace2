import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "./main.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NzGridModule } from "ng-zorro-antd/grid";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzListModule } from "ng-zorro-antd/list";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSliderModule } from "ng-zorro-antd/slider";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { TimePipe } from "./time.pipe";
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
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: testImports,
        declarations: [AppComponent],
        providers: [MainService, OptionsService, FormatPipe, TimePipe]
      }).compileComponents();
    })
  );

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
