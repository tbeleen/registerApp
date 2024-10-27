import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnoService } from 'src/app/servicios/firebase/alumno.service';

@Component({
  selector: 'app-detalle-docente',
  templateUrl: './detalle-docente.page.html',
  styleUrls: ['./detalle-docente.page.scss'],
})
export class DetalleDocentePage implements OnInit {

  nombreDocente?: string;

  alumnos : Alumno[]= [];

  alumnosFiltrados: Alumno[] = [];
  //El activateRouter sirve para capturar informacion
  constructor(private activateRoute:ActivatedRoute, private router:Router,private alumnoServices: AlumnoService) { }

  ngOnInit() {
    this.nombreDocente = this.activateRoute.snapshot.paramMap.get('nombre') || '';
    this.filtrarAlumnosPorDocente();
    //console.log(this.activateRoute.snapshot.paramMap.get('nombre')) con este codigo podemos capturar la info 

  }

  filtrarAlumnosPorDocente() {
    this.alumnosFiltrados = this.alumnos.filter(aux=> aux.docente === this.nombreDocente)
  }

  // Redirecciona a la pagina detalle alumno cuando se hace click
  verDetalleAlumno(aux:any){ 
    this.router.navigate(['detalle-alumnos', aux.nombre]);
  }

}
