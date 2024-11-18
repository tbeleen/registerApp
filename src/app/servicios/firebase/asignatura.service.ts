import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import firebase from 'firebase/compat/app'; // Importar firebase para acceder a FieldValue
import { Asignatura } from 'src/app/interfaces/asignatura';
import { first } from 'rxjs/operators';


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

  obtenerAsignaturaPorId(id: string) {
    return this.firestore.collection('asignaturas').doc(id).valueChanges().pipe(first()).toPromise();
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

  async asignarClaseADocente(docenteId: string, nuevaClaseNombre: string) {
    const docenteRef = this.firestore.collection('usuarios').doc(docenteId);
  
    // Obtén el documento del docente
    const docenteDoc = await docenteRef.get().toPromise();
  
    if (docenteDoc && docenteDoc.exists) {
        const data = docenteDoc.data() as { clases?: string[] }; // Especifica el tipo de datos
        const clasesActuales: string[] = data?.clases || []; // Usa el dato de manera segura
        
        // Verifica si la clase ya está en el array
        if (!clasesActuales.includes(nuevaClaseNombre)) {
            // Agrega solo el nombre de la nueva clase al array
            clasesActuales.push(nuevaClaseNombre);
            
            // Actualiza el documento del docente
            await docenteRef.update({ clases: clasesActuales });
        } else {
            console.log('La clase ya está asignada al docente');
        }
    } else {
        console.error('El docente no existe o no se pudo obtener el documento');
    }
  }

  async obtenerAsignaturaPorNombre(nombreAsignatura: string) {
    if (!nombreAsignatura) {
      console.error('El nombre de la asignatura está vacío.');
      return null;
    }
  
    const asignaturaSnapshot = await this.firestore.collection('asignaturas', ref =>
      ref.where('nombre', '==', nombreAsignatura)
    ).get().toPromise();
  
    if (asignaturaSnapshot && !asignaturaSnapshot.empty) {
      const asignaturaDoc = asignaturaSnapshot.docs[0];
      const asignaturaData = asignaturaDoc.data() as Asignatura; // Agregar el tipo Asignatura
  
      // Extraer el UID del docente, los alumnos y el nombre de la asignatura
      const uidDocente = asignaturaData.docente;
      const alumnosUID = asignaturaData.alumnos || [];
      const nombre = asignaturaData.nombre;
  
      console.log('Asignatura encontrada:', asignaturaData);
      console.log('UID Docente:', uidDocente);
      console.log('Alumnos UID:', alumnosUID);
      console.log('Nombre de la asignatura:', nombre);
  
      return {
        docente: uidDocente,
        alumnos: alumnosUID,
        nombre: nombre
      };
    } else {
      console.warn('No se encontró la asignatura con el nombre especificado');
      return null;
    }
  } 
}
