import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private alertController: AlertController) {}

  async sendResetLink() {
    if (this.email) {
      const alert = await this.alertController.create({
        header: 'Correo Enviado',
        message: 'Se ha enviado un enlace para restablecer tu contraseña a ' + this.email,
        buttons: ['OK'],
        cssClass: 'custom-alert' // Estilo opcional para personalizar la alerta
      });
      await alert.present();
    }
  }
}
