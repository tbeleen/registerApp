import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Usuario } from 'src/app/interfaces/usuario';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { AuthService } from 'src/app/servicios/firebase/auth.service';
@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

  asignatura : Asignatura[] = [];
  usuarioId: string = '';

  constructor(private router:Router,
              private asignaturaService:AsignaturaService,
              private menuController:MenuController,
              private authservice: AuthService,
              private navController: NavController,
              private firestore: AngularFirestore,
              private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    this.menuController.enable(true);
    this.obtenerAsignaturas();
   
  

    const usuarioData = this.route.snapshot.paramMap.get('datosUsuario');
  if (usuarioData) {
    const usuarioLogin = JSON.parse(usuarioData);
    console.log('Datos del usuario recibidos:', usuarioLogin);
    // Procesar los datos según sea necesario
  }
  
  }
  verAsignaturas(aux:any) {
    this.router.navigate(['detalle-asignatura', aux.id]);
  }

  logout(){
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
  
  async obtenerAsignaturas() {
    const usuarioLogin = JSON.parse(localStorage.getItem('usuarioLogin') || '{}'); // Obtener usuario logueado
    if (usuarioLogin && usuarioLogin.clases) {
      const asignaturasPromises = usuarioLogin.clases.map((claseId: string) => 
        this.firestore.collection('asignaturas').doc(claseId).ref.get()
      );
  
      const asignaturasDocs = await Promise.all(asignaturasPromises);
      this.asignatura = asignaturasDocs.map(doc => ({ id: doc.id, ...doc.data() })) as Asignatura[];
      console.log('Asignaturas obtenidas:', this.asignatura); // Para verificar que se están recuperando
    }
  }

 
}
