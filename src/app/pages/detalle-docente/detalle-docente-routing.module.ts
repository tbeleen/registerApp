import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleDocentePage } from './detalle-docente.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleDocentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleDocentePageRoutingModule {}
