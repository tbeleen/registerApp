import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/servicios/firebase/auth.service';
import { NativeBiometric } from 'capacitor-native-biometric';
@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  isLogged: boolean = false;

  constructor(private router: Router, 
              private authService: AuthService,
              private firestore: AngularFirestore) { }
  
  ngOnInit() { 
    setTimeout(() => {
      this.checkLogin();    
    }, 2000);
  }

  async checkLogin(){
    this.authService.isLogged().subscribe(async(user)=> {
      if(user) {
        try {
        //Verificamos con la huella
        await this.checkHuellaDigital();
        const usuario = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
        const userData = usuario?.data() as Usuario;
        if(userData){
          if(userData.tipo ==='admin'){
            this.router.navigate(['/admin-dashboard']);
          }else if(userData.tipo ==='docente'){
            this.router.navigate(['/docente-dashboard']);
          }else if(userData.tipo ==='alumno'){
            this.router.navigate(['/alumno-dashboard']);
          }else {
            this.router.navigate(['/invitado-dashboard']);
          }
        }
        } catch (error) {
          this.router.navigate(['login']);
        }
      }else {
        this.router.navigate(['login']);
      }
    });
  }

  async checkHuellaDigital() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Por favor, autentícate para continuar',
        title: 'Autenticación Biométrica',
        subtitle: 'Usa tu huella digítal o Face ID',
        description:'Coloca tu huella en el sensor para ingresar.'
      });
    }catch(error){
      throw error;
    }
  }
}
