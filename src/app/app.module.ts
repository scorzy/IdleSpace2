import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { MaterialTopComponent } from "./material-top/material-top.component";
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
import { ModuleInfoComponent } from "./designer/module-info/module-info.component";
import { BattleReportComponent } from "./battle-report/battle-report.component";
import { WeaponViewComponent } from "./weapon-view/weapon-view.component";
import { SpaceStationsComponent } from "./space-stations/space-stations.component";
import { CellComponent } from "./battle/cell/cell.component";
import { ModComponent } from "./units/mod/mod.component";
import { ModLineComponent } from "./units/mod-line/mod-line.component";
import { ListComponent } from "./designer/list/list.component";
import { BiComponent } from "./units/bi/bi.component";
import { ProdTableComponent } from "./units/prod-table/prod-table.component";
import { AutoAttackOptionsComponent } from "./battle/auto-attack-options/auto-attack-options.component";
import { FleetsViewComponent } from "./fleets-view/fleets-view.component";
import { BaseComponentComponent } from "./base-component/base-component.component";
import { PricesComponent } from "./prices/prices.component";
import { ResearchPreviewComponent } from "./laboratory/research-preview/research-preview.component";
import { HtmlTreeComponent } from "./laboratory/html-tree/html-tree.component";
import { TreeNodeComponent } from "./laboratory/tree-node/tree-node.component";
import { BuildingsComponent } from "./units/buildings/buildings.component";
import { DepartmentComponent } from "./units/department/department.component";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzConfig, NZ_CONFIG } from "ng-zorro-antd/core/config";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzListModule } from "ng-zorro-antd/list";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSliderModule } from "ng-zorro-antd/slider";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NZ_I18N, en_US } from "ng-zorro-antd/i18n";
import { UiComponent } from "./options/ui/ui.component";
import { NzCascaderModule } from "ng-zorro-antd/cascader";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { AutoBuildingComponent } from "./auto-buy/auto-building/auto-building.component";
import { AutoWorkerComponent } from "./auto-buy/auto-worker/auto-worker.component";
import { ReportListComponent } from "./battle-report/report-list/report-list.component";
import { AutomationComponent } from "./automation/automation.component";
import { AutoFleetUpComponent } from "./auto-buy/auto-fleet-up/auto-fleet-up.component";
import { AutoSearchComponent } from "./auto-buy/auto-search/auto-search.component";
import { SpellBarComponent } from "./spell-bar/spell-bar.component";
import { PrestigeShopComponent } from "./prestige-shop/prestige-shop.component";
import { PrestigeComponent } from "./prestige/prestige.component";
import { WarpComponent } from "./warp/warp.component";
import { CardsComponent } from "./cards/cards.component";
import { PrestigeCardComponent } from "./cards/prestige-card/prestige-card.component";
import { AutoSpaceComponent } from "./auto-buy/auto-space/auto-space.component";
import { InfoComponent } from "./info/info.component";
import { AutoSurrenderComponent } from "./auto-buy/auto-surrender/auto-surrender.component";
import { UnitListComponent } from "./unit-list/unit-list.component";
import { UnitDetailComponent } from "./unit-list/unit-detail/unit-detail.component";
import { StorageComponent } from "./units/storage/storage.component";
import { UnitMenuComponent } from "./unit-list/unit-menu/unit-menu.component";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { AutoRefreshComponent } from "./auto-buy/auto-refresh/auto-refresh.component";
import { AutoModComponent } from "./auto-buy/auto-mod/auto-mod.component";
import { AutoFullComponent } from "./auto-buy/auto-full/auto-full.component";
import { DistrictInfoComponent } from "./units/district-info/district-info.component";
import { HotKeysComponent } from "./options/hot-keys/hot-keys.component";
import { ChallengeListComponent } from "./challenge-list/challenge-list.component";
import { ChallengeComponent } from "./challenge-list/challenge/challenge.component";
import { AutoPrestigeComponent } from './auto-buy/auto-prestige/auto-prestige.component';
import { PlayfabEmailComponent } from './save/playfab-email/playfab-email.component';

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
    WeaponViewComponent,
    SpaceStationsComponent,
    CellComponent,
    ModComponent,
    ModLineComponent,
    ListComponent,
    BiComponent,
    ProdTableComponent,
    AutoAttackOptionsComponent,
    FleetsViewComponent,
    BaseComponentComponent,
    PricesComponent,
    ResearchPreviewComponent,
    HtmlTreeComponent,
    TreeNodeComponent,
    BuildingsComponent,
    DepartmentComponent,
    UiComponent,
    NotificationListComponent,
    AutoBuildingComponent,
    AutoWorkerComponent,
    ReportListComponent,
    AutomationComponent,
    AutoFleetUpComponent,
    AutoSearchComponent,
    SpellBarComponent,
    PrestigeShopComponent,
    PrestigeComponent,
    WarpComponent,
    CardsComponent,
    PrestigeCardComponent,
    AutoSpaceComponent,
    InfoComponent,
    AutoSurrenderComponent,
    UnitListComponent,
    UnitDetailComponent,
    StorageComponent,
    UnitMenuComponent,
    AutoRefreshComponent,
    AutoModComponent,
    AutoFullComponent,
    DistrictInfoComponent,
    HotKeysComponent,
    ChallengeListComponent,
    ChallengeComponent,
    AutoPrestigeComponent,
    PlayfabEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCardModule,
    DragDropModule,
    FlexLayoutModule,
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
    NzDrawerModule,
    NzPageHeaderModule,
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
    NzCascaderModule,
    NzDropDownModule,
    NzPopconfirmModule,
    NzMessageModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    MainService,
    OptionsService,
    FormatPipe,
    TimePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
