import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { AdminService } from 'src/app/servicios/firebase/admin.service';
import { AlumnoService } from 'src/app/servicios/firebase/alumno.service';
import { AuthService } from 'src/app/servicios/firebase/auth.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  emailValue?: string;
  passValue?: string;

  usuarios: Usuario[]= [];

  constructor(private router: Router,
              private formBuilder:FormBuilder, 
              private alertController:AlertController, 
              private loadingcontroller: LoadingController,
              private menuController:MenuController,
              private alumnoService: AlumnoService,
              private authservices : AuthService,
              private firestore:AngularFirestore,
              private mensaje:MensajesService) {
    this.loginForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      pass : ['', [Validators.required, Validators.minLength(6)]],
    });
  }
    
  ngOnInit() {
    this.menuController.enable(false);
    this.loginForm.reset();
  }
  // creamos la funcion login que creamos en el html
  async login() {
    try {
      const loading = await this.loadingcontroller.create({
        message: 'Cargando...',
        duration: 2000
      });
  
      const email = this.emailValue;
      const pass = this.passValue;
      const usuarioFirebase = await this.authservices.login(email as string, pass as string);
  
      if (usuarioFirebase.user) {
        await loading.present();
  
        // Obtener la información del usuario desde Firestore
        const usuarioDoc = await this.firestore.collection('usuarios').doc(usuarioFirebase.user.uid).get().toPromise();
        const userData = usuarioDoc?.data() as Usuario;
  
        if (userData) {
          // Guardar los datos del usuario en localStorage
          localStorage.setItem('usuarioLogin', JSON.stringify(userData));
  
          // Redirigir al dashboard correspondiente según el tipo de usuario
          setTimeout(async () => {
            await loading.dismiss();
            if (userData.tipo === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (userData.tipo === 'docente') {
              this.router.navigate(['/docente-dashboard']);
            } else if (userData.tipo === 'alumno') {
              this.router.navigate(['/alumno-dashboard']);
            } else {
              this.router.navigate(['/invitado-dashboard']);
            }
          }, 2000);
        } else {
          // Si no se encuentra la información del usuario en Firestore
          await loading.dismiss();
          this.mensaje.mensaje('No se pudo encontrar la información del usuario. Intente nuevamente.','error','Error!');
        }
      } else {
        // Si el usuario de Firebase no existe
        this.mensaje.mensaje('Error en las credenciales, inténtelo nuevamente!','error','Error!');
      }
    } catch (error) {
      this.mensaje.mensaje('Ocurrió un error al iniciar sesión. Inténtelo nuevamente!','error','Error!');
    }
  }
  

  goToForgotPassword() {
    console.log('hola');
    this.router.navigate(['recovery']);
  }

}
