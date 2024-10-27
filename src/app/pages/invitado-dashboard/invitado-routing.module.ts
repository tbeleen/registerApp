import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitadoPage } from './invitado.page';

const routes: Routes = [
  {
    path: '',
    component: InvitadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitadoPageRoutingModule {}
