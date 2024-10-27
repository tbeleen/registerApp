import { Component, OnInit } from '@angular/core';
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
  selectedAsignaturaId: string | null = null;
  
  constructor(private authServices:AuthService, private asignaturaService: AsignaturaService) { }

  ngOnInit() {
    //Obtenemos el uid del usuario logeado y lo asignamos al qr
    this.authServices.isLogged().subscribe(async user => {
      if (user) {
          this.qrValue = user.uid; // Esto no es necesario aquí, puedes eliminarlo
  
          try {
              // Obtén las asignaturas del docente
              const asignaturas = await firstValueFrom(this.asignaturaService.getAsignaturasPorDocente(user.uid));
              const fecha = new Date().toISOString();
  
              if (asignaturas && asignaturas.length > 0) {
                  // Aquí puedes elegir cómo seleccionar la asignatura. Por ejemplo, si tienes un dropdown
                  // o cualquier otro método para seleccionar la asignatura actual.
                  
                  // Supongamos que quieres seleccionar la primera asignatura como ejemplo:
                  const selectedAsignatura = asignaturas[0]; // Cambia esto si tienes un método de selección
  
                  // Asegúrate de que 'id' esté correctamente definido en el objeto de la asignatura seleccionada
                  if (selectedAsignatura && selectedAsignatura.id) {
                      this.qrValue = JSON.stringify({
                          docenteId: user.uid,
                          asignaturas: selectedAsignatura.id, // Asegúrate de que estás tomando el id correcto
                          fecha: fecha
                      });
                      console.log('QR generado:', this.qrValue);
                  } else {
                      console.error('Asignatura seleccionada no válida');
                  }
              } else {
                  console.warn('No se encontraron asignaturas para el docente.');
              }
          } catch (error) {
              console.error('Error al obtener las asignaturas:', error);
          }
      } else {
          console.error('Usuario no autenticado');
      }
  });
  }  
}
