import { Component } from '@angular/core';
import { Page } from './interfaces/page';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from './interfaces/usuario';
import { AsignaturaService } from './servicios/firebase/asignatura.service';
import { v4 as uuidv4 } from 'uuid';
import { RandomUserService } from './servicios/random-user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: Page[] = [];
  public tipoUsuario?: string;
  public emailUsuario?: string;
  public alumno: any[] = [];
  public docente: any[] = [];

  private seleccionarAsignaturasAleatorias(asignaturas: any[], numAsignaturas: number): any[] {
    // Mezclar las asignaturas y tomar solo las necesarias
    const mezcladas = asignaturas.sort(() => 0.5 - Math.random());
    return mezcladas.slice(0, numAsignaturas);
  }

  constructor(private router: Router, private randomUserService: RandomUserService, private firestore:AngularFirestore, private asignaturaService: AsignaturaService) {}
  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogin');

    if (usuario) {
      //con el .parce estamos destructurando la info del JSON solo para que lea el tipo usuario 
      const aux = JSON.parse(usuario);
      this.tipoUsuario = aux.tipo;
      this.emailUsuario = aux.email;
      this.configSideMenu();
    } else {
      this.router.navigate(['/login']);
    }
  }

  generarContrasena(longitud: number): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let pass = '';
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      pass += caracteres.charAt(indice);
    }
    return pass;
  }

  // Función para generar 5 docentes aleatorios
generarDocentes() {
  this.randomUserService.getRandomUsers().subscribe(async data => {
    const { docentes } = data;

    // Asegúrate de que tenemos suficientes docentes
    if (docentes.length < 5) {
      console.error('No se obtuvieron suficientes docentes.');
      return;
    }

    // Crear solo 5 docentes
    const allDocentes = docentes.slice(0, 5);

    for (const user of allDocentes) {
      const uniqueId = uuidv4();
      const pass = this.generarContrasena(10); // Cambia el número para la longitud deseada

      console.log(`Procesando docente: ${user.email}`); // Log para depuración

      await this.firestore.collection('usuarios').doc(uniqueId).set({
        ...user,
        tipo: 'docente',
        uid: uniqueId,
        pass
      });

      // Obtener asignaturas aleatorias
      const todasLasAsignaturas = await this.asignaturaService.obtenerAsignaturasAleatorias(5);
      const asignaturasAleatorias = this.seleccionarAsignaturasAleatorias(todasLasAsignaturas.filter(asig => !asig.docente), 3);
      const clases = asignaturasAleatorias.map(asig => asig.id);

      await this.firestore.collection('usuarios').doc(uniqueId).update({ clases });

      // Actualizar las asignaturas correspondientes
      for (const asignatura of asignaturasAleatorias) {
        asignatura.docente = uniqueId;
        await this.asignaturaService.actualizarAsignatura(asignatura.id, { docente: uniqueId });
      }
    }

    console.log('5 docentes generados y guardados correctamente.');
  }, error => {
    console.error('Error al generar docentes:', error);
  });
}

// Función para generar 5 alumnos aleatorios
generarAlumnos() {
  this.randomUserService.getRandomUsers().subscribe(async data => {
    const { alumnos } = data;

    // Asegúrate de que tenemos suficientes alumnos
    if (alumnos.length < 5) {
      console.error('No se obtuvieron suficientes alumnos.');
      return;
    }

    // Crear solo 5 alumnos
    const allAlumnos = alumnos.slice(0, 5);

    for (const user of allAlumnos) {
      const uniqueId = uuidv4();
      const pass = this.generarContrasena(10); // Cambia el número para la longitud deseada

      console.log(`Procesando alumno: ${user.email}`); // Log para depuración

      await this.firestore.collection('usuarios').doc(uniqueId).set({
        ...user,
        tipo: 'alumno',
        uid: uniqueId,
        pass
      });

      // Obtener asignaturas aleatorias
      const todasLasAsignaturas = await this.asignaturaService.obtenerAsignaturasAleatorias(5);
      const asignaturasAleatorias = this.seleccionarAsignaturasAleatorias(todasLasAsignaturas, 5);
      const clases = asignaturasAleatorias.map(asig => asig.id);

      await this.firestore.collection('usuarios').doc(uniqueId).update({ clases });
    }

    console.log('5 alumnos generados y guardados correctamente.');
  }, error => {
    console.error('Error al generar alumnos:', error);
  });
}
  

  configSideMenu() {
    if (this.tipoUsuario === 'admin') {
      this.appPages = [
        { title: 'Home', url: '/admin-dashboard', icon: 'home' },
        { title: 'Administrar Usuarios', url: '/admin-users', icon: 'people' },
        { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
      ]
    }else if (this.tipoUsuario === 'docente'){
      this.appPages = [
        { title: 'Home', url: '/docente-dashboard', icon: 'home' },
        { title: 'Asignaturas', url: '/asignaturas', icon: 'happy' },
        { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
      ]

    }else if (this.tipoUsuario === 'alumno'){
      this.appPages = [
        { title: 'Home', url: '/alumno-dashboard', icon: 'home' },
        { title: 'Asignaturas', url: '/asignaturas', icon: 'happy' },
        { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
      ]
    }else {
      this.appPages = [
        { title: 'Home', url: '/invitado-dashboard', icon: 'home' },
        { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
      ]
    }
  }
}
