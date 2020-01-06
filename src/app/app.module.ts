import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  NgZorroAntdModule,
  NZ_I18N,
  en_US,
  NzConfig,
  NZ_CONFIG
} from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { MaterialTopComponent } from "./material-top/material-top.component";
import { NzGridModule } from "ng-zorro-antd/grid";
import { FormatPipe } from "./format.pipe";
import { MainService } from "./main.service";
import { OptionsService } from "./options.service";
import { UnitsComponent } from "./units/units.component";
import { UnitCardComponent } from "./units/unit-card/unit-card.component";
import { NzCardModule } from "ng-zorro-antd/card";
import { SubTableComponent } from "./units/sub-table/sub-table.component";
import { ProdInfoComponent } from "./material-top/prod-info/prod-info.component";
import { LaboratoryComponent } from "./laboratory/laboratory.component";
import { OptionsComponent } from "./options/options.component";
import { SaveComponent } from "./save/save.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { JobComponent } from "./job/job.component";
import { ProgressComponent } from "./progress/progress.component";
import { TimePipe } from "./time.pipe";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AddComponent } from "./designer/add/add.component";
import { NzFormModule } from "ng-zorro-antd/form";
import { TechnologiesComponent } from "./technologies/technologies.component";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { ResearchPrioritiesComponent } from "./research-priorities/research-priorities.component";
import { EditComponent } from "./designer/edit/edit.component";
import { SizePipe } from "./size.pipe";
import { ShipyardComponent } from "./shipyard/shipyard.component";
import { SearchComponent } from "./enemy/search/search.component";
import { EnemiesListComponent } from "./enemy/enemies-list/enemies-list.component";
import { EnemyDetailComponent } from "./enemy/enemy-detail/enemy-detail.component";
import { ShipsViewComponent } from "./ships-view/ships-view.component";
import { DesignInfoComponent } from "./design-info/design-info.component";
import { BattleComponent } from "./battle/battle.component";
import { BattleTableComponent } from "./battle/battle-table/battle-table.component";
import { ModulesComponent } from "./designer/modules/modules.component";
import { ModuleInfoComponent } from './designer/module-info/module-info.component';
import { BattleReportComponent } from './battle-report/battle-report.component';
import { WeaponViewComponent } from './weapon-view/weapon-view.component';

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  notification: { nzPlacement: "bottomRight" }
};

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MaterialTopComponent,
    FormatPipe,
    UnitsComponent,
    UnitCardComponent,
    SubTableComponent,
    ProdInfoComponent,
    LaboratoryComponent,
    OptionsComponent,
    SaveComponent,
    JobComponent,
    ProgressComponent,
    TimePipe,
    AddComponent,
    TechnologiesComponent,
    ResearchPrioritiesComponent,
    EditComponent,
    SizePipe,
    ShipyardComponent,
    SearchComponent,
    EnemiesListComponent,
    EnemyDetailComponent,
    ShipsViewComponent,
    DesignInfoComponent,
    BattleComponent,
    BattleTableComponent,
    ModulesComponent,
    ModuleInfoComponent,
    BattleReportComponent,
    WeaponViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzGridModule,
    NzCardModule,
    DragDropModule,
    FlexLayoutModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputNumberModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    MainService,
    OptionsService,
    FormatPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
