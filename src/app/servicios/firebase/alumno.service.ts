import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Alumno } from 'src/app/interfaces/alumno';
import firebase from 'firebase/compat/app'; // Importar firebase completo

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(private firestore: AngularFirestore) { }

  //obtenemos a todos los alumnos
  getAlumnos(): Observable<Alumno[]> {
    return this.firestore.collection<Alumno>('usuarios').valueChanges();
  }
  
   // Obtener alumnos por asignatura
  getAlumnosPorClase(asignatura: string) {
    return this.firestore.collection<Alumno>('usuarios', ref =>
      ref.where('clases', 'array-contains', asignatura).where('tipo', '==', 'alumno')
    ).valueChanges();
   
  }
}



