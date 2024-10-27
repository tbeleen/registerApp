import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Docente } from 'src/app/interfaces/docente';
import { AsignaturaService } from './asignatura.service';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(private firestore: AngularFirestore,
              private asignaturaService: AsignaturaService
  ) { }

   //obtenemos a todos los docentes
   getDocente(): Observable<Docente[]> {
    return this.firestore.collection<Docente>('usuarios').valueChanges();
  }
  
   // Obtener docentes por asignatura
   getDocentePorClase(asignaturaId: string) {
    return this.firestore.collection<Docente>('usuarios', ref =>
      ref.where('clases', 'array-contains', asignaturaId).where('tipo', '==', 'docente')
    ).valueChanges();
  }
}
