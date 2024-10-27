
export interface Asignatura {
    id:string;
    nombre: string;
    docente?:string;
    alumnos?:string[];
    fecha?: Date;
}
