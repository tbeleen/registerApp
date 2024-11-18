import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarAsigPageRoutingModule } from './editar-asig-routing.module';

import { EditarAsigPage } from './editar-asig.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarAsigPageRoutingModule
  ],
  declarations: [EditarAsigPage]
})
export class EditarAsigPageModule {}
