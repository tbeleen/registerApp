import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  login(email:string,pass:string){
    return this.angularFireAuth.signInWithEmailAndPassword(email,pass);
  }

   /**
   * Inicia sesión con Google.
   */
  loginWithGoogle() {
    return this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(error => {
        console.error('Error al iniciar sesión con Google:', error);
        throw error;
      });
  }

  loginWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider)
      .then(result => {
        console.log('Usuario autenticado con GitHub:', result);
        return result;
      })
      .catch(error => {
        console.error('Error al iniciar sesión con GitHub:', error);
        throw error;
      });
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

  getUsuarioActualId(): string | null {
    return localStorage.getItem('usuarioActualId');
  }

  // Función para establecer el ID del usuario actual (cuando el usuario inicia sesión)
  setUsuarioActualId(id: string): void {
    localStorage.setItem('usuarioActualId', id);
  }

  // Función para limpiar el ID del usuario actual (cuando el usuario cierra sesión)
  clearUsuarioActualId(): void {
    localStorage.removeItem('usuarioActualId');
  }
  
}
