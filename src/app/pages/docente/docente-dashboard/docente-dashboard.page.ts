import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Asignatura } from 'src/app/interfaces/asignatura';


@Component({
  selector: 'app-docente-dashboard',
  templateUrl: './docente-dashboard.page.html',
  styleUrls: ['./docente-dashboard.page.scss'],
})
export class DocenteDashboardPage implements OnInit {
  
  docente: Asignatura[] = [];
  usuarioLogin? : string;
  constructor(private menuController:MenuController, private router: Router) { }

  ngOnInit() {
    this.menuController.enable(true);
    this.usuarioLogin = localStorage.getItem('usuarioLogin') || '';
  }

  

}
