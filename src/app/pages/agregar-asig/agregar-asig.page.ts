import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { AsignaturaService } from 'src/app/servicios/firebase/asignatura.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-asig',
  templateUrl: './agregar-asig.page.html',
  styleUrls: ['./agregar-asig.page.scss'],
})
export class AgregarAsigPage implements OnInit {

  nuevaAsignatura = { nombre: ''};
  asignaturas: Asignatura[] = [];


  constructor(private asignaturaService: AsignaturaService,
              private navController: NavController,
              private firestore: AngularFirestore,
              private mensajesService: MensajesService,) {
    const usuarioLogin = localStorage.getItem('usuarioLogin');
    try{
      const usuario = JSON.parse(usuarioLogin || '{}');
    }catch(error){
      console.error('Error al analizar el usuario:', error)
    }
    
  }

  ngOnInit() {
    this.obtenerAsignaturas();
    const tipo = localStorage.getItem('usuarioLogin');
    if (tipo) {
      try {
        const usuario = JSON.parse(tipo);
        if (usuario.tipo !== 'admin') {
          // Redirigir o mostrar un mensaje
          console.error('No tienes permisos para agregar asignaturas');
          // Aquí puedes redirigir al usuario a otra página
          // this.router.navigate(['/otra-pagina']);
        }
      } catch (error) {
        console.error('Error al analizar el tipo de usuario:', error);
      }
    }
  }

  goBack() {
    this.navController.navigateBack('/admin-dashboard'); // Reemplaza con la ruta deseada
  }

  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  async agregarAsignatura() {
    const nombreAsignatura = this.normalizeText(this.nuevaAsignatura.nombre.trim());

    if (!nombreAsignatura) {
      this.mensajesService.mensaje('El nombre de la asignatura no puede estar vacío.','warning','Advertencia!')
      return;
    }

    try {
      // Verificar si la asignatura ya existe
      const asignaturaSnapshot = await this.firestore
        .collection('asignaturas', ref => ref.where('nombre', '==', nombreAsignatura))
        .get()
        .toPromise();

      if (asignaturaSnapshot && !asignaturaSnapshot.empty) {
        this.mensajesService.mensaje('La asignatura ya existe.','error','Error!')
        return;
      }

      this.nuevaAsignatura.nombre = nombreAsignatura;
      this.nuevaAsignatura.nombre = this.nuevaAsignatura.nombre.trim();

      // Si no existe, proceder a agregarla
      await this.asignaturaService.agregarAsignatura(nombreAsignatura, this.nuevaAsignatura);
      this.mensajesService.mensaje('Asignatura agregada exitosamente!','success','Éxito!')

      // Limpiar el formulario
      this.nuevaAsignatura = { nombre: ''}; 
    } catch (error) {
      console.error('Error al agregar asignatura:', error);
      this.mensajesService.mensaje('No se pudo agregar la asignatura. Inténtalo de nuevo.','error','Error!')
    }
  }

  obtenerAsignaturas() {
    this.asignaturaService.getobtenerAsignaturas().subscribe((asignaturas) => {
      this.asignaturas = asignaturas;
      console.log('Asignaturas obtenidas:', this.asignaturas);
    });
  }

  async eliminarAsignatura(id: string) {
    try {
      await this.firestore.collection('asignaturas').doc(id).delete();
      this.mensajesService.mensaje('Asignatura eliminara con éxito','success','Eliminación éxitosa')
      console.log(`Asignatura con ID ${id} eliminada correctamente.`);
      this.asignaturas = this.asignaturas.filter(asignatura => asignatura.id !== id); // Actualiza la lista en el frontend
    } catch (error) {
      this.mensajesService.mensaje('No se puedo eliminar la asignatura','error','Error!')
      console.error("Error eliminando la asignatura: ", error);
    }
  }
}
