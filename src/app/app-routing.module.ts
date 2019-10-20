import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnitsComponent } from "./units/units.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/units" },
  { path: "units", pathMatch: "full", component: UnitsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
