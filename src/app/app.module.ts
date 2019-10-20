import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { MaterialTopComponent } from "./material-top/material-top.component";
import { NzGridModule } from "ng-zorro-antd/grid";
import { FormatPipe } from "./format.pipe";
import { IconsProviderModule } from "./iconModule/icons-provider.module";
import { MainService } from "./main.service";
import { OptionsService } from "./options.service";
import { UnitsComponent } from './units/units.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MaterialTopComponent,
    FormatPipe,
    UnitsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzGridModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    MainService,
    OptionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
