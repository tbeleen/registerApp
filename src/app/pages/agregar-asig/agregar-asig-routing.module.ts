import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarAsigPage } from './agregar-asig.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarAsigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarAsigPageRoutingModule {}
