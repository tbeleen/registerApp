import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular'; // Importa NavController

@Component({
  selector: 'app-invitado',
  templateUrl: './invitado.page.html',
  styleUrls: ['./invitado.page.scss'],
})
export class InvitadoPage implements OnInit {

  showInfo: boolean = false;
  nombreUsuario: string = '';

  constructor(private menuController: MenuController, private navCtrl: NavController, private router:Router) { }

  ngOnInit() {
    this.menuController.enable(false);
    const usuario = JSON.parse(localStorage.getItem('usuarioLogin') || '{}' );
    this.nombreUsuario = usuario.nombre;
  }

  // Función para ir a la página de login
  goToLogin() {
    this.navCtrl.navigateForward('/login');
  }

  // Función para ir a la página de registro
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  toggleInfo() {
    this.showInfo = !this.showInfo; // Cambia el estado de la variable
  }
}

