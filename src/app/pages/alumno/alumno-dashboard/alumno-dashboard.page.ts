import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Route, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-alumno-dashboard',
  templateUrl: './alumno-dashboard.page.html',
  styleUrls: ['./alumno-dashboard.page.scss'],
})

export class AlumnoDashboardPage implements OnInit {
  

  usuarioLogin? : string;

  constructor(private menuController: MenuController,
              private firestore: AngularFirestore,
              private router: Router
  ) { }

  ngOnInit() {
    this.menuController.enable(true);
    const usuarioLogin = localStorage.getItem('usuarioLogin');
  
  if (usuarioLogin) {
    // Asegúrate de analizar el JSON correctamente
    this.usuarioLogin = JSON.parse(usuarioLogin); // Esto ahora debe ser un objeto
  }
}

   // Obtener alumnos por el id de la clase
  getAlumnosPorClase(claseId: string): Observable<any[]> {
    return this.firestore.collection('clases').doc(claseId).valueChanges().pipe(
      map((clase: any) => clase.alumnos)
    );
  }

  // Obtener el docente por el id de la clase
  getDocentePorClase(claseId: string): Observable<any> {
    return this.firestore.collection('clases').doc(claseId).valueChanges().pipe(
      map((clase: any) => clase.docenteId)
    );
  }

  verAsig() {
    const usuarioLogin = localStorage.getItem('usuarioLogin');

  if (usuarioLogin) {
    const usuarioData = JSON.parse(usuarioLogin);
    console.log(usuarioData); // Muestra el objeto de usuario en la consola
    // Aquí puedes manejar lo que desees con los datos del usuario
  }

  this.router.navigate(['/asignaturas']);
  }

  mapa() {
    this.router.navigate(['/mapa']);
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 10,
  };

  registroAsis() {
    this.router.navigate(['/registro-asistencia']);
  }
  

}
