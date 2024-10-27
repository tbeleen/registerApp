import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAsignaturaPageRoutingModule } from './detalle-asignatura-routing.module';

import { DetalleAsignaturaPage } from './detalle-asignatura.page';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAsignaturaPageRoutingModule,
  ],
  declarations: [DetalleAsignaturaPage,BarcodeScanningModalComponent]
})
export class DetalleAsignaturaPageModule {}
