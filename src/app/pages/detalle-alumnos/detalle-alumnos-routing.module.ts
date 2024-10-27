import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleAlumnosPage } from './detalle-alumnos.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleAlumnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleAlumnosPageRoutingModule {}
