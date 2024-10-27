import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Alumno } from 'src/app/interfaces/alumno';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  
  constructor(private firestore: AngularFirestore) { }

  registrarAsistencia(asignaturaId: string, alumnoId: string, estado: string) {
    const sessionId = new Date().getTime().toString(); // Generar un ID de sesión único
    const asistenciaData = {
      asignaturaId,
      alumnoId,
      estado,
      timestamp: new Date()
    };

    return this.firestore.collection('asistencia').doc(`${sessionId}-${alumnoId}`).set(asistenciaData, { merge: true })
      .then(() => {
        console.log('Asistencia registrada con éxito');
      })
      .catch((error) => {
        console.error('Error registrando asistencia: ', error);
      });
  }

  
}
