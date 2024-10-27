import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class RandomUserService {

  private apiUrl = 'https://randomuser.me/api/?results=10';

  constructor(private http: HttpClient) { }

  getRandomUsers(): Observable<{ alumnos: Usuario[], docentes: Usuario[] }> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        // Asignar tipo y correos a los alumnos
        const alumnos: Usuario[] = data.results.slice(0, 5).map((user: any) => ({
          nombre: `${user.name.first} ${user.name.last}`, // Usa espacio entre nombres
          email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@alumno.com`,
          tipo: 'alumno',
        }));
  
        // Asignar tipo y correos a los docentes
        const docentes: Usuario[] = data.results.slice(5, 10).map((user: any) => ({
          nombre: `${user.name.first} ${user.name.last}`, // Usa espacio entre nombres
          email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@docente.com`,
          tipo: 'docente',
        }));
  
        return { alumnos, docentes };
      })
    );
  }
}
