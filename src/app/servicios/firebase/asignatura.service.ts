import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import firebase from 'firebase/compat/app'; // Importar firebase para acceder a FieldValue
import { Asignatura } from 'src/app/interfaces/asignatura';


@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(private firestore: AngularFirestore) {}

  // Agregar una nueva asignatura
  
  async agregarAsignatura(asignaturaId: string, asignaturaData: any) {
    // Agregar la asignatura
    await this.firestore.collection('asignaturas').doc(asignaturaId).set(asignaturaData);
  }

  getobtenerAsignaturas(): Observable<Asignatura[]> {
    return this.firestore.collection<Asignatura>('asignaturas').valueChanges({ idField: 'id' });
  }

  
  agregarAlumnoAAsignatura(asignaturaId: string, alumnoId: string) {
    return this.firestore.collection('asignaturas').doc(asignaturaId).update({
      alumnos: firebase.firestore.FieldValue.arrayUnion(alumnoId) // Usamos arrayUnion para agregar al array
    });
  }
  // Método para actualizar una asignatura
  actualizarAsignatura(id: string, data: Partial<Asignatura>): Promise<void> {
    return this.firestore.collection('asignaturas').doc(id).update(data);
  }

  // Eliminar un alumno de una asignatura
  eliminarAlumnoDeAsignatura(asignaturaId: string, alumnoId: string) {
    return this.firestore.collection('asignaturas').doc(asignaturaId).update({
      alumnos: firebase.firestore.FieldValue.arrayRemove(alumnoId) // Usamos arrayRemove para eliminar del array
    });
  }

  // Obtener todas las asignaturas
  obtenerAsignaturas(){
    return this.firestore.collection('asignaturas').valueChanges();
  } 

  async obtenerAsignaturasAleatorias(cantidad: number): Promise<Asignatura[]> {
    const snapshot = await this.firestore.collection<Asignatura>('asignaturas').get().toPromise();
    if (!snapshot || snapshot.empty) {
      return []; // Retorna un arreglo vacío si no hay documentos
    }

    // Mapeo de documentos
    const asignaturas: Asignatura[] = snapshot.docs.map(doc => {
      const data = doc.data() as Asignatura; // Asegúrate de que 'Asignatura' tenga la estructura adecuada
      return { ...data, id: doc.id }; // Agrega el id al objeto
    });

    // Mezclar y seleccionar aleatorias
    const asignaturasAleatorias = asignaturas.sort(() => 0.5 - Math.random()).slice(0, cantidad);
    return asignaturasAleatorias;
  }

  getAsignaturaPorId(id: string): Promise<Asignatura> {
    return this.firestore.collection<Asignatura>('asignaturas').doc(id).get().toPromise().then(doc => {
      if (!doc?.exists) {
        throw new Error(`No se encontró la asignatura con id: ${id}`);
      }
      
      const data = doc.data();
      if (!data) {
        throw new Error(`No hay datos para la asignatura con id: ${id}`);
      }
  
      // Desestructurar data y excluir el campo id si existe
      const { id: _, ...asignaturaData } = data; // _ se usa para indicar que estamos ignorando 'id'
  
      return { id: id, ...asignaturaData } as Asignatura; // Crear nuevo objeto sin id sobrescrito
    });
  }
  getAsignaturasPorDocente(docenteId: string) {
    return this.firestore.collection('asignaturas', ref =>
      ref.where('docente', '==', docenteId)
    ).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data: any = a.payload.doc.data(); // Datos de la asignatura (incluye 'nombre')
          return {
            nombre: data.nombre || 'Sin nombre', // Devuelve el nombre
            id: a.payload.doc.id // Devuelve el ID del documento
          };
        })
      )
    );
  }
  
}
