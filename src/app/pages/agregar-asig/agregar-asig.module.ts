import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarAsigPageRoutingModule } from './agregar-asig-routing.module';

import { AgregarAsigPage } from './agregar-asig.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarAsigPageRoutingModule
  ],
  declarations: [AgregarAsigPage]
})
export class AgregarAsigPageModule {}
