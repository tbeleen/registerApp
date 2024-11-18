import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Docente } from 'src/app/interfaces/docente';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { DocenteService } from 'src/app/servicios/firebase/docente.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';

@Component({
  selector: 'app-editar-asig',
  templateUrl: './editar-asig.page.html',
  styleUrls: ['./editar-asig.page.scss'],
})
export class EditarAsigPage implements OnInit {

  asignaturaId: string = '';
  asignatura: Asignatura = { id: '', nombre: '', docente: '' };
  docentes: Docente[] = [];
  

  constructor(private route: ActivatedRoute,
              private firestore: AngularFirestore,
              private docenteService: DocenteService,
              private asignaturaService:AsignaturaService,
              private mensajesService:MensajesService) { }

  ngOnInit() {
    this.asignaturaId = this.route.snapshot.paramMap.get('id')!;
    console.log('ID de la asignatura:', this.asignaturaId);
    this.cargarAsignatura();
    this.cargarDocentes();
  }

  cargarAsignatura() {
    // Verificar que el ID de la asignatura no sea vacío
    if (this.asignaturaId) {
      this.firestore.collection('asignaturas').doc(this.asignaturaId).valueChanges()
        .subscribe((data) => {
          if (data) {
            this.asignatura = data as Asignatura;
            console.log('Datos de la asignatura:', this.asignatura); // Verificar datos obtenidos
          } else {
            console.error('Asignatura no encontrada.');
          }
        }, (error) => {
          console.error('Error al cargar asignatura:', error);
        });
    } else {
      console.error('ID de asignatura no válido.');
    }
  }


  cargarDocentes() {
    this.docenteService.obtenerDocentes().subscribe((docentes) => {
      this.docentes = docentes;
      console.log('Docentes obtenidos:', this.docentes); // Para verificar que los datos se están cargando
    });
  }

  guardarAsignatura() {
    this.firestore.collection('asignaturas').doc(this.asignaturaId).update(this.asignatura).then(() => {
      console.log('Asignatura actualizada');
  
      // Asigna solo el nombre de la asignatura al docente en su array 'clases'
      if (this.asignatura.docente) {
        this.asignaturaService.asignarClaseADocente(this.asignatura.docente, this.asignatura.nombre)
          .then(() => {
            console.log('Asignatura asignada al docente');
          })
          .catch(error => {
            console.error('Error al asignar la asignatura al docente:', error);
          });
      } else {
        console.error('No se especificó un docente para la asignatura');
      }
    });
  }

  async asignarClaseADocente(docenteId: string, nuevaClaseNombre: string) {
    const docenteRef = this.firestore.collection('usuarios').doc(docenteId);
  
    // Obtén el documento del docente
    const docenteDoc = await docenteRef.get().toPromise();
  
    if (docenteDoc && docenteDoc.exists) {
        const data = docenteDoc.data() as { clases?: string[] }; // Especifica el tipo de datos
        const clasesActuales: string[] = data?.clases || []; // Usa el dato de manera segura
        
        // Verifica si la clase ya está en el array
        if (!clasesActuales.includes(nuevaClaseNombre)) {
            // Agrega solo el nombre de la nueva clase al array
            clasesActuales.push(nuevaClaseNombre);
            
            // Actualiza el documento del docente
            await docenteRef.update({ clases: clasesActuales });
        } else {
            console.log('La clase ya está asignada al docente');
        }
    } else {
        console.error('El docente no existe o no se pudo obtener el documento');
    }
  }
}
