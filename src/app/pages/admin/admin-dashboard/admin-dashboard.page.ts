import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Route, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Usuario } from 'src/app/interfaces/usuario';
import { AdminService } from 'src/app/servicios/firebase/admin.service';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { AuthService } from 'src/app/servicios/firebase/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {

  usuarios: any[] = [];

  constructor(private menuController:MenuController,
              private adminService:AdminService,
              private firestore:AngularFirestore,
              private router: Router,
              private authservice: AuthService,
              private asignaturaService:AsignaturaService
  ) { }

  ngOnInit() {
    this.menuController.enable(true);
    this.config();
  }

  config() {
    const aux = this.adminService.getUsuarios();
    this.firestore.collection('usuarios').valueChanges().subscribe(aux => {
      this.usuarios = aux;
    });
    
  };
  //FUNCION PARA NAVEGAR A OTRA PAGINA ENVIANDO EL UID DEL USER
  editarUser(uid:string) {
    this.router.navigate(['/edit-user', uid]);
  }

  logout(){
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

  agregar_asig(){
    this.router.navigate(['/agregar-asig'])
  }

  

}