import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitadoPageRoutingModule } from './invitado-routing.module';

import { InvitadoPage } from './invitado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvitadoPageRoutingModule
  ],
  declarations: [InvitadoPage]
})
export class InvitadoPageModule {}
