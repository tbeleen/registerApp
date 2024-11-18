import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Usuario } from 'src/app/interfaces/usuario';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { AuthService } from 'src/app/servicios/firebase/auth.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loginForm: FormGroup;
  emailValue: string = '';
  passValue: string = '';

  constructor(private router: Router,
              private formBuilder:FormBuilder, 
              private loadingcontroller: LoadingController,
              private authService: AuthService,
              private menuController:MenuController,
              private firestore: AngularFirestore,
              private asignaturaService: AsignaturaService,
              private mensaje: MensajesService
            ) {

    this.loginForm = this.formBuilder.group({
      nombre:['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]],
      pass : ['', [Validators.required, Validators.minLength(6)]],
      tipoUsuario: ['',[Validators.required]]
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
    this.loginForm.reset();
  }

  async register(){
    const tipoUsuario = this.loginForm.get('tipoUsuario')?.value || 'invitado';
    const nombreUsuario = this.loginForm.get('nombre')?.value || 'Nombre usuario';

    if(!this.isValidEmail(this.emailValue, tipoUsuario)) {
      this.mensaje.mensaje('Correo inválido para el tipo de usuario seleccionado', 'error', 'Correo inválido');
      return;
    }

    const nuevoUsuario: Usuario = {
      uid: '',
      nombre: nombreUsuario,
      email: this.emailValue || '',
      pass: this.passValue || '',
      tipo: tipoUsuario,
      clases: [], 
      estadoAsistencia: 'Ausente'
    };

    try {
      const usuarioFirebase = await this.authService.register(this.emailValue,this.passValue);
      const user = usuarioFirebase.user;

      if(user) {
        nuevoUsuario.uid = user.uid;
        nuevoUsuario.email = user.email || '';

        // Guardar el usuario en FireStore.
        await this.firestore.collection('usuarios').doc(user.uid).set({
          uid: nuevoUsuario.uid,
          nombre: nombreUsuario,
          email: nuevoUsuario.email,
          pass: this.passValue,
          tipo: tipoUsuario,
          clases:[],
          estadoAsistencia: 'Ausente' 
        });

        if (tipoUsuario === 'docente' || tipoUsuario === 'alumno') {
          // Obtener asignaturas aleatorias
          const todasLasAsignaturas = await this.asignaturaService.obtenerAsignaturasAleatorias(5);
          let  numAsignaturas = tipoUsuario === 'docente' ? 3 : 5;

          // Filtrar asignaturas para docentes
          let asignaturasFiltradas = tipoUsuario === 'docente' 
            ? todasLasAsignaturas.filter(asignatura => !asignatura.docente)
            : todasLasAsignaturas;

          const asignaturasAleatorias = this.seleccionarAsignaturasAleatorias(asignaturasFiltradas, numAsignaturas);
          nuevoUsuario.clases = asignaturasAleatorias.map(asig => asig.id);

          await this.firestore.collection('usuarios').doc(user.uid).update({
            clases: nuevoUsuario.clases
          });

          // Actualizar asignaturas con el ID del alumno
          for (const asignatura of asignaturasAleatorias) {
            asignatura.alumnos = asignatura.alumnos || []; // Asegúrate de inicializar el array si no existe
            if (!asignatura.alumnos.includes(user.uid)) { // Evitar duplicados
              asignatura.alumnos.push(user.uid);
            }
            await this.asignaturaService.actualizarAsignatura(asignatura.id, { alumnos: asignatura.alumnos }); // Actualizar la asignatura
          }

          if (tipoUsuario === 'docente') {
            for (const asignatura of asignaturasAleatorias) {
              asignatura.docente = user.uid;
              await this.asignaturaService.actualizarAsignatura(asignatura.id, { docente: user.uid });
            }
          }

        } else if (tipoUsuario === 'invitado') {
          // Redirigir a página de invitado
          this.router.navigate(['/invitado-dashboard']);
          return;
        }

        localStorage.setItem('usuarioLogin', JSON.stringify(nuevoUsuario));
        this.mensaje.mensaje("Cuenta creada correctamente!", "success", "Éxito!").then(() => {
          this.router.navigate(['/login']);
        });
      }  
    } catch (error) {
      this.mensaje.mensaje("Error al crear la cuenta de usuario, intentelo nuevamente!", "error", "Error!");
    } 
  }

  isValidEmail(email: string, tipoUsuario: 'alumno' | 'docente' | 'admin' | 'invitado'): boolean {
    const validPatterns: { [key: string]: string } = {
      alumno: '@alumno.com',
      docente: '@docente.com',
      admin: '@admin.com',
      invitado: '@invitado.com'
    };
  
    const expectedDomain = validPatterns[tipoUsuario];
    return email.endsWith(expectedDomain);
  }

  private seleccionarAsignaturasAleatorias(asignaturas: Asignatura[], cantidad: number): Asignatura[] {
    // Lógica para seleccionar asignaturas aleatorias
    const shuffle = (array: Asignatura[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return shuffle(asignaturas).slice(0, cantidad);
  }

  verCuenta() {
    this.router.navigate(['/login']);
  }

}
