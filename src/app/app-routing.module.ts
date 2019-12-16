import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnitsComponent } from "./units/units.component";
import { LaboratoryComponent } from "./laboratory/laboratory.component";
import { OptionsComponent } from "./options/options.component";
import { SaveComponent } from "./save/save.component";
import { AddComponent } from "./designer/add/add.component";
import { DesignListComponent } from "./designer/design-list/design-list.component";
import { TechnologiesComponent } from "./technologies/technologies.component";
import { ResearchPrioritiesComponent } from "./research-priorities/research-priorities.component";
import { EditComponent } from "./designer/edit/edit.component";
import { ShipyardComponent } from "./shipyard/shipyard.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/units/ws" },
  { path: "units/:id", pathMatch: "full", component: UnitsComponent },
  { path: "lab", pathMatch: "full", component: LaboratoryComponent },
  { path: "tech", pathMatch: "full", component: TechnologiesComponent },
  { path: "resPri", pathMatch: "full", component: ResearchPrioritiesComponent },
  { path: "opt", pathMatch: "full", component: OptionsComponent },
  { path: "save", pathMatch: "full", component: SaveComponent },
  { path: "ship", pathMatch: "full", component: ShipyardComponent },
  { path: "des", pathMatch: "full", redirectTo: "/des/add" },
  {
    path: "des",
    component: DesignListComponent,
    children: [
      { path: "add", component: AddComponent },
      { path: "edit/:id", component: EditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
