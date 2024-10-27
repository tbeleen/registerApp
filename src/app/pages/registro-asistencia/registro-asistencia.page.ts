import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Route } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnoService } from 'src/app/servicios/firebase/alumno.service';
import { AsistenciaService } from 'src/app/servicios/firebase/asistencia.service';

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {

  alumnos: Alumno[] = [];
  nombreAsignatura: string = '';
  asistenciaList: any[] = [];

  constructor(private asistenciaService: AsistenciaService,private activateRoute:ActivatedRoute, private firestore: AngularFirestore, private alumnoService:AlumnoService) { }

  ngOnInit() {
    const asignaturaId = this.activateRoute.snapshot.paramMap.get('asignaturaId') || '';
    this.nombreAsignatura = this.activateRoute.snapshot.paramMap.get('nombre') || '';

    // Cargar la lista de alumnos
    this.cargarAlumnos(asignaturaId);

    // Cargar la asistencia desde Firestore
    this.cargarAsistencia(asignaturaId);
  }

  cargarAlumnos(asignaturaId: string) {
    // Cambiar a suscripción para obtener alumnos
    this.alumnoService.getAlumnosPorClase(asignaturaId).subscribe(alumnos => {
      this.alumnos = alumnos;
      this.actualizarEstadoAsistencia(); // Asegúrate de actualizar la asistencia después de obtener los alumnos
    });
  }

  cargarAsistencia(asignaturaId: string) {
    this.firestore.collection('asistencia', ref => ref.where('asignaturaId', '==', asignaturaId))
      .valueChanges()
      .subscribe(asistencia => {
        this.asistenciaList = asistencia;
        this.actualizarEstadoAsistencia(); // Actualiza el estado de asistencia cuando se carga
      });
  }

  actualizarEstadoAsistencia() {
    // Actualizar el estado de cada alumno en función de la lista de asistencia
    this.alumnos.forEach(alumno => {
      const registro = this.asistenciaList.find(a => a.alumnoId === alumno.id);
      alumno.estadoAsistencia = registro ? registro.estado : 'Ausente'; // 'Presente' o 'Ausente'
    });
  }


}
