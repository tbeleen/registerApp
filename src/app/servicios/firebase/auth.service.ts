import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  login(email:string,pass:string){
    return this.angularFireAuth.signInWithEmailAndPassword(email,pass);
  }

  logout(){
    return this.angularFireAuth.signOut();
  }

  isLogged(): Observable<any>{
    return this.angularFireAuth.authState;
  }

  register(email:string, pass:string){
    return this.angularFireAuth.createUserWithEmailAndPassword(email,pass);
  }

  recoveryPassword(email:string) {
    return this.angularFireAuth.sendPasswordResetEmail(email)
    .then(() => {
      console.log('Correo enviado!');
    })
    .catch((error) => {
      console.log('Error al enviar correo de recuperación!');
      throw error;
    })
  }

  async asignarAsignaturas(usuarioId: string, tipo: 'Alumno' | 'Profesor') {
    const asignaturasSnapshot = await this.firestore.collection('asignaturas').get().toPromise();
    let asignaturasAsignadas: string[] = []; // Definir el tipo explícitamente como string[]

    if (asignaturasSnapshot && asignaturasSnapshot.size > 0) {
        // Asignar aleatoriamente algunas asignaturas
        asignaturasAsignadas = asignaturasSnapshot.docs.map(doc => doc.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3); // Ejemplo: asignar 3 al azar
    }

    // Actualizar el usuario con las asignaturas asignadas
    await this.firestore.collection('usuarios').doc(usuarioId).update({
        clases: asignaturasAsignadas
    });
  }
  
}
