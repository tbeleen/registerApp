import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAlumnosPageRoutingModule } from './detalle-alumnos-routing.module';

import { DetalleAlumnosPage } from './detalle-alumnos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAlumnosPageRoutingModule
  ],
  declarations: [DetalleAlumnosPage]
})
export class DetalleAlumnosPageModule {}
