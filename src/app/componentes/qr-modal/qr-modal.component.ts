import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QRCodeGeneratorService } from 'src/app/servicios/qrcode-generator.service';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit {

  @Input() dataToEncode: string = '';
  qrCode: string = '';

  constructor(private qrCodeGenerator: QRCodeGeneratorService,
              private modalController: ModalController) { }

  async ngOnInit() {
    try {
      this.qrCode = await this.qrCodeGenerator.generateQRCode(this.dataToEncode);
    } catch (error) {
      console.error('Error generando el código QR:', error);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
