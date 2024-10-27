import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: AngularFirestore) { }

  getUsuarios(): Observable<any[]> {
    // Retorna un Observable que contiene la colección de usuarios
    return this.firestore.collection('usuarios').valueChanges();
  }

}
