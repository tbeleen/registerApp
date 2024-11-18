import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { AuthService } from 'src/app/servicios/firebase/auth.service';

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.page.html',
  styleUrls: ['./generate-qr.page.scss'],
})
export class GenerateQrPage implements OnInit {

  qrValue = ''

  asignaturas: any[] = []; // Para almacenar las asignaturas
  asignaturaId: string | undefined;

  selectedAsignaturaId: string | null = null;

  nombreAsignatura: string | null = null;

  uidDocente: string | null = null;
  alumnosUID: string[] = [];
  
  constructor(private authServices:AuthService, private asignaturaService: AsignaturaService, private route: ActivatedRoute) { }

   async ngOnInit() {
    // Obtener el nombre de la asignatura desde la URL
    this.nombreAsignatura = this.route.snapshot.paramMap.get('nombreAsignatura');
    if (this.nombreAsignatura) {
      // Obtener detalles de la asignatura y mostrar el QR
      const asignatura = await this.asignaturaService.obtenerAsignaturaPorNombre(this.nombreAsignatura);
      if (asignatura) {
        // Crear el valor del código QR
        this.qrValue = JSON.stringify({
          docente: asignatura.docente,
          alumnos: asignatura.alumnos,
          nombre: asignatura.nombre,
        });
        console.log('QR generado:', this.qrValue);
      } else {
        console.warn('No se encontró la asignatura con el nombre proporcionado.');
      }
    } else {
      console.error('No se encontró nombreAsignatura en la URL.');
    }
  }
}
