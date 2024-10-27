import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoService } from 'src/app/servicios/firebase/alumno.service';


@Component({
  selector: 'app-detalle-alumnos',
  templateUrl: './detalle-alumnos.page.html',
  styleUrls: ['./detalle-alumnos.page.scss'],
})
export class DetalleAlumnosPage implements OnInit {

  // creamos variables para recivir en el param
  nombreAlumno?:string;
  apellidoAlumno?: string;

  constructor(private activateRoute:ActivatedRoute,
              private alumnoService: AlumnoService
  ) { }

  ngOnInit(){}

}
