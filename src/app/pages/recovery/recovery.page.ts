import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {
  emailValue:string='';
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async recoveryPassword(){
    try{
      let timerInterval: any;
      await this.authService.recoveryPassword(this.emailValue);
      Swal.fire({
        title: "Procesando!",
        html: "Enviando correo...",
        timer: 2000,
        timerProgressBar: true,
        heightAuto: false,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup()!.querySelector("b") ;
          timerInterval = setInterval(() => {
            timer!.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          
          Swal.fire({
            title: "Éxito!",
            text: "Correo enviado correctamente!",
            icon: "success",
            confirmButtonText: "OK",
            heightAuto: false
          });
        }
      });
    }catch (error){

    }
  }

}
