import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  private map:any;
  private userMarker: L.Marker<any> | undefined;

  constructor(private navController: NavController) { }

  ngOnInit() {
    this.crearMapa();
  }

  crearMapa() {
    this.map = L.map('map').setView([-33.59861770964677, -70.57945577454743],19);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    const icon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png', // Ruta del icono del marcador
      shadowUrl: 'assets/leaflet/marker-shadow.png', // Ruta de la sombra del marcador
      iconSize: [25, 41], // Tamaño del icono
      iconAnchor: [12, 41], // Punto del icono que se ubicará en las coordenadas
      shadowSize: [41, 41], // Tamaño de la sombra
    });

    this.userMarker = L.marker([-33.59861770964677, -70.57945577454743], { icon })
      .addTo(this.map)
      .openPopup();

      L.circle([-33.59861770964677, -70.57945577454743], {
        color: 'blue',    // Color del borde del círculo
        fillColor: '#30f', // Color de relleno
        fillOpacity: 0.2,  // Opacidad del relleno
        radius: 80        // Radio en metros
      }).addTo(this.map);

  }

  goBack() {
    this.navController.navigateBack('/alumno-dashboard'); 
  }

}
