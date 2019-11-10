import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnitsComponent } from "./units/units.component";
import { LaboratoryComponent } from "./laboratory/laboratory.component";
import { OptionsComponent } from "./options/options.component";
import { SaveComponent } from "./save/save.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/units/ws" },
  { path: "units/:id", pathMatch: "full", component: UnitsComponent },
  { path: "lab", pathMatch: "full", component: LaboratoryComponent },
  { path: "opt", pathMatch: "full", component: OptionsComponent },
  { path: "save", pathMatch: "full", component: SaveComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
