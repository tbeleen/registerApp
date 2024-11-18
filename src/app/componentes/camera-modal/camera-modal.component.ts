import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss'],
})
export class CameraModalComponent {
  constructor(private modalController: ModalController) {}

  handleQrCodeResult(result: string) {
    console.log('Scanned QR code:', result);
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
