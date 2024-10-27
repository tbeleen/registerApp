import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute,Router } from '@angular/router';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { Alumno } from 'src/app/interfaces/alumno';
import { Docente } from 'src/app/interfaces/docente';
import { AlumnoService } from 'src/app/servicios/firebase/alumno.service';
import { DocenteService } from 'src/app/servicios/firebase/docente.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { Geolocation } from '@capacitor/geolocation';
import { MensajesService } from 'src/app/servicios/mensajes.service';

@Component({
  selector: 'app-detalle-asignatura',
  templateUrl: './detalle-asignatura.page.html',
  styleUrls: ['./detalle-asignatura.page.scss'],
})

export class DetalleAsignaturaPage implements OnInit {

  nombreAsignatura?: string;
  nombreAlumno?: string;
  apellidoAlumno?: string;
  nombreDocente?:string;
  apellidoDocente?:string;

  alumnos: Alumno[] = [];
  docentes: Docente[] = [];

  docente?: boolean;
  alumno?: boolean;
  profesorAsignado?: Docente | null;

  qrCodeData: string | null = null;
  resultadoQR = '';

  constructor(private activateRoute: ActivatedRoute,
              private alertController: AlertController,
              private alumnoService: AlumnoService,
              private modalController: ModalController,
              private firestore: AngularFirestore,
              private navController: NavController,
              private docenteService: DocenteService,
              private router:Router,
              private platform: Platform,
              private mensaje: MensajesService) { }


  ngOnInit() {

    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }

    //Obtener el nombre de la asignatura o ID de clase desde la URL
    const asignaturaId = this.activateRoute.snapshot.paramMap.get('asignaturaId') || '';

    this.nombreAsignatura = this.activateRoute.snapshot.paramMap.get('nombre') || '';
     // Verificar si el usuario es docente o alumno
    const tipo = localStorage.getItem('usuarioLogin');
    if(tipo) {
      const usuario = JSON.parse(tipo);

      this.docente = usuario.tipo === 'docente';
      this.alumno = usuario.tipo === 'alumno';
    }

   // Obtener alumnos de la asignatura
    this.alumnoService.getAlumnosPorClase(this.nombreAsignatura).subscribe((alumnos) => {
    this.alumnos = alumnos; // Solo los alumnos
  });

    // Obtener el profesor asignado
    this.docenteService.getDocentePorClase(this.nombreAsignatura).subscribe((docentes) => {
      if (docentes.length > 0) {
        this.profesorAsignado = docentes[0]; // Almacenar el primer docente encontrado
        console.log('Docente asignado:', this.profesorAsignado);
      } else {
        console.warn('No se encontró un docente asignado para esta asignatura.');
      }
    });
  }

  crear_qr() {
    this.navController.navigateForward(['/generate-qr'])
  }

  async obtenerAsignaturaPorNombre(nombreAsignatura: string) {
    try {
      const asignaturaSnapshot = await this.firestore.collection('asignaturas', ref =>
        ref.where('nombre', '==', nombreAsignatura)
      ).get().toPromise();
  
      if (asignaturaSnapshot && !asignaturaSnapshot.empty) {
        const asignaturaDoc = asignaturaSnapshot.docs[0];
        const asignaturaData = asignaturaDoc.data();
        const asignaturaId = asignaturaDoc.id;
  
        console.log('Asignatura encontrada:', asignaturaData);
  
        // Retornar tanto el ID como los datos
        return {
          id: asignaturaId,
          data:asignaturaData // Incluye todos los datos de la asignatura
        };
      } else {
        console.warn('No se encontró la asignatura con el nombre especificado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la asignatura:', error);
      return null;
    }
  }
  
  goBack() {
    this.navController.navigateBack('/asignaturas'); 
  }

  // creamos un modal el cual tiene la camara

  async openCamera() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanner-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: 'Back',
      },
    });
  
    await modal.present();
  
    // Después de leer el QR
    const { data } = await modal.onDidDismiss();
  
    if (data?.barcode?.displayValue) {
      try {
        // Convertir la cadena en un objeto JSON
        const qrData = JSON.parse(data.barcode.displayValue);
        console.log('Datos del QR:', qrData);
  
        // Extraer información del QR
        const { docenteId, asignaturas, fecha } = qrData;
  
        // Mostrar los datos en la interfaz o usarlos según tu lógica
        this.resultadoQR = `Docente: ${docenteId}, Asignatura: ${asignaturas}, Fecha: ${fecha}`;
  
        // Obtener la ubicación actual para verificar asistencia
        const position = await Geolocation.getCurrentPosition();
        const { latitude: lat, longitude: lng } = position.coords;
  
        // Coordenadas de Duoc UC Puente Alto
        const duocLat = -33.59861770964677;
        const duocLng = -70.57945577454743;
        const maxDistance = 0.5; // en kilómetros
  
        if (this.isWithinRadius(lat, lng, duocLat, duocLng, maxDistance)) {
          await this.updateAttendanceStatus(docenteId, asignaturas, 'Presente', fecha);
          console.log('Asistencia marcada como "Presente".');
        } else {
          console.warn('El alumno no está dentro del área permitida.');
        }
      } catch (error) {
        console.error('Error al procesar el QR:', error);
      }
    } else {
      console.warn('El código QR está vacío o no se pudo leer.');
    }
  }
  


  isWithinRadius(lat1: number, lng1: number, lat2: number, lng2: number, maxDistance: number): boolean {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= maxDistance;
  }

  async updateAttendanceStatus(docenteId: string, asignatura: string, status: string, fecha: string) {
    try {
      await this.firestore.collection('usuarios').doc(docenteId).update({
        estadoAsistencia: status,
        ultimaAsistencia: fecha,
        asignatura: asignatura
      });
      console.log('Estado de asistencia actualizado:', status);
    } catch (error) {
      console.error('Error al actualizar Firebase:', error);
      this.mensaje.mensaje('Error con Firebase', 'error', 'error');
    }
  }
  
}