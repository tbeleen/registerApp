import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute,Route,Router } from '@angular/router';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { Alumno } from 'src/app/interfaces/alumno';
import { Docente } from 'src/app/interfaces/docente';
import { AlumnoService } from 'src/app/servicios/firebase/alumno.service';
import { DocenteService } from 'src/app/servicios/firebase/docente.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { Geolocation } from '@capacitor/geolocation';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { AuthService } from 'src/app/servicios/firebase/auth.service';

@Component({
  selector: 'app-detalle-asignatura',
  templateUrl: './detalle-asignatura.page.html',
  styleUrls: ['./detalle-asignatura.page.scss'],
})

export class DetalleAsignaturaPage implements OnInit {

  nombreAsignatura?: string | null = null;
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

  asignaturaId: string = '';
  asignatura: any;
  usuarioActualId: string | null = null;


  constructor(private activateRoute: ActivatedRoute,
              private alertController: AlertController,
              private alumnoService: AlumnoService,
              private modalController: ModalController,
              private firestore: AngularFirestore,
              private navController: NavController,
              private docenteService: DocenteService,
              private router:Router,
              private platform: Platform,
              private mensaje: MensajesService,
              private route: ActivatedRoute,
              private asignaturaService: AsignaturaService,
              private authService: AuthService) { }


  ngOnInit() {

    this.usuarioActualId = this.authService.getUsuarioActualId();

    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }

    //Obtener el nombre de la asignatura o ID de clase desde la URL

    this.nombreAsignatura = this.route.snapshot.paramMap.get('nombreAsignatura') || '';
  
    if (this.nombreAsignatura) {
      this.cargarAsignatura(this.nombreAsignatura);
    } else {
      console.error('No se encontró nombreAsignatura en la URL.');
    }
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

  async cargarAsignatura(nombreAsignatura: string) {
    // Usa el nombre para obtener los detalles de la asignatura
    this.asignatura = await this.asignaturaService.obtenerAsignaturaPorNombre(nombreAsignatura);
  
    if (this.asignatura) {
      console.log('Detalles de la asignatura:', this.asignatura);
    } else {
      console.warn('No se encontró la asignatura con el nombre especificado.');
    }
  }

  crear_qr(nombreAsignatura: string) {
    if (nombreAsignatura) {
      this.router.navigate(['/generate-qr', this.nombreAsignatura]), {
        queryParams: { nombreAsignatura }
      }
    } else {
      console.error('El nombre de la asignatura no es válido.');
    }
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
    console.log('Datos del modal:', data);
  
    if (data?.barcode?.displayValue) {
      try {
        console.log('Contenido del QR:', data.barcode.displayValue);
  
        // Convertir la cadena en un objeto JSON
        const qrData = JSON.parse(data.barcode.displayValue);
        console.log('Datos parseados del QR:', qrData);
  
        // Validar que todos los campos necesarios están presentes
        if (!qrData?.docente || !qrData?.alumnos || !qrData?.nombre) {
          console.error('El QR no contiene todos los datos necesarios:', qrData);
          return;
        }
  
        // Desestructurar los datos del QR
        const { docente, alumnos, nombre } = qrData;
        this.resultadoQR = `Docente: ${docente}, Asignatura: ${nombre}`;
  
        // Verificar si el alumno actual está en la lista de alumnos en el QR
        if (!alumnos.includes(this.usuarioActualId)) {
          console.warn('El usuario actual no está autorizado para marcar asistencia.');
          return;
        }
  
        // Actualizar el estado de asistencia del alumno en Firebase
        await this.updateAttendanceStatus(this.usuarioActualId!, nombre, 'Presente', new Date().toISOString());
        console.log('Asistencia marcada como "Presente".');
  
      } catch (error) {
        console.error('Error al procesar el QR:', error);
      }
    } else {
      console.warn('El código QR está vacío o no se pudo leer.');
    }
  }
  
  
  async requestGeolocationPermission(): Promise<boolean> {
    const status = await Geolocation.requestPermissions();
    return status.location === 'granted';
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
  
  async updateAttendanceStatus(alumnoId: string, asignatura: string, status: string, fecha: string) {
    try {
      // Obtener el documento del alumno
      const alumnoDoc = await this.firestore.collection('usuarios').doc(alumnoId).get().toPromise();
  
      if (!alumnoDoc || !alumnoDoc.exists) {
        console.error('No se encontró el alumno con el ID:', alumnoId);
        return;
      }
  
      const alumnoData = alumnoDoc.data() as Alumno;
      console.log('Datos del alumno obtenidos:', alumnoData);
  
      // Verificar si el alumno tiene el estado de asistencia "Ausente"
      if (alumnoData?.estadoAsistencia === 'Ausente') {
        console.log('Estado de asistencia actual: Ausente');
  
        // Actualizar el estado de asistencia a "Presente"
        await this.firestore.collection('usuarios').doc(alumnoId).update({
          estadoAsistencia: status,
          ultimaAsistencia: fecha,
          asignatura: asignatura,
        });
  
        console.log('Estado de asistencia del alumno actualizado a "Presente".');
  
        // Verificar si la actualización fue exitosa
        const updatedAlumnoDoc = await this.firestore.collection('usuarios').doc(alumnoId).get().toPromise();
  
        if (!updatedAlumnoDoc || !updatedAlumnoDoc.exists) {
          console.error('No se encontró el documento del alumno después de la actualización.');
          return;
        }
  
        const updatedAlumnoData = updatedAlumnoDoc.data() as Alumno;
        console.log('Datos actualizados del alumno:', updatedAlumnoData);
      } else {
        console.log('El alumno ya está presente o no tiene el estado "Ausente".');
      }
    } catch (error) {
      console.error('Error al actualizar Firebase:', error);
      this.mensaje.mensaje('Error con Firebase', 'error', 'error');
    }
  }
  
  registroAsis(){
    this.router.navigate(['/registro-asistencia'])
  }
  
}