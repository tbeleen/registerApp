export interface Usuario {
    uid:string;
    nombre: string;
    email: string;
    pass: string;
    tipo: 'alumno' | 'docente' | 'invitado' | 'admin';
    clases: string[];
    estadoAsistencia?:string;
}