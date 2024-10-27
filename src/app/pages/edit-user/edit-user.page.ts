import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router} from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { MensajesService } from 'src/app/servicios/mensajes.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  uid: string = '';
  editUserForm: FormGroup;

  constructor(private activatedRoute:ActivatedRoute,
              private firestore:AngularFirestore,
              private formBuilder: FormBuilder,
              private mensajeService: MensajesService,
              private router: Router
            ) { 
              this.editUserForm = this.formBuilder.group({
              nombre: ['',[Validators.required]],
              email: ['',[Validators.required, Validators.email]],
              pass: ['',[Validators.required]],
              tipo: ['',[Validators.required]],

      });
    }

  ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') as string  
    this.loadData();
  }

  loadData() {
    this.firestore.collection('usuarios').doc(this.uid).get().toPromise()
    .then((user)=> {
      if (user){
        const userData = user?.data() as Usuario;
        this.editUserForm.patchValue({
          email: userData.email,
          nombre: userData.nombre,
          pass: userData.pass,
          tipo: userData.tipo
        })
      }
    })
    .catch(error=>{

    });
  }

  async actualizarUser() {
    if (this.editUserForm.valid) {
      try {
        await this.firestore.collection('usuarios').doc(this.uid).update(this.editUserForm.value);
        this.mensajeService.mensaje('Usuario modificado con éxito', 'success', 'Modificación exitosa');
        await this.router.navigate(['/admin-dashboard']); 
      } catch (error) {
        console.error('Error al modificar el usuario:', error);
        this.mensajeService.mensaje('Error al modificar el usuario', 'error', 'Error');
      }
    } else {
      console.error('Formulario inválido:', this.editUserForm.errors); // Agrega esto para verificar errores de validación
    }
  }

  async eliminarUser() {
    if (!this.uid) {
      console.error('UID del usuario no está definido');
      this.mensajeService.mensaje('Error al eliminar el usuario', 'error', 'El UID no está definido');
      return;
    }
  
    try {
      // Eliminar el usuario de la colección 'usuarios'
      await this.firestore.collection('usuarios').doc(this.uid).delete();
  
      // Obtener todas las asignaturas que están asociadas a este usuario (docente)
      const asignaturasSnapshot = await this.firestore.collection('asignaturas', ref =>
        ref.where('docente', '==', this.uid)
      ).get().toPromise();
  
      // Verificar si 'asignaturasSnapshot' no es undefined o vacío
      if (asignaturasSnapshot && !asignaturasSnapshot.empty) {
        // Crear un batch para actualizar las asignaturas en una sola operación
        const batch = this.firestore.firestore.batch();
  
        // Eliminar el ID del docente en las asignaturas relacionadas
        asignaturasSnapshot.forEach(doc => {
          const asignaturaRef = this.firestore.collection('asignaturas').doc(doc.id).ref;
          batch.update(asignaturaRef, { docente: null }); // Actualizar el campo 'docente' a null
        });
  
        // Ejecutar las actualizaciones en batch
        await batch.commit();
      }
  
      // Mostrar mensaje de éxito
      this.mensajeService.mensaje('Usuario y asignaturas actualizadas correctamente', 'success', 'Eliminación exitosa');
  
      // Redirigir a la página de administración
      await this.router.navigate(['/admin-dashboard']); 
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      this.mensajeService.mensaje('Error al eliminar el usuario', 'error', 'Error');
    }
  }
}
