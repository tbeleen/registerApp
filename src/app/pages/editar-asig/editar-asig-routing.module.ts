import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarAsigPage } from './editar-asig.page';

const routes: Routes = [
  {
    path: '',
    component: EditarAsigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarAsigPageRoutingModule {}
