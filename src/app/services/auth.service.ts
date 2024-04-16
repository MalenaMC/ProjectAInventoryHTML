import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

interface DataRegister {
  name: string;
  lastName: string;
  dni: number;
  dateOfBirth: Date;
  email: string;
  password: string;
}
interface DataLogin {
  email: string;
  password: string;
}
interface DataRecover {
  email: string;
}
interface DataRecoverPassword{
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 
  private httpService = inject(HttpClient);
  // 
  private auth_end_point = 'http://localhost:3000';
  constructor() { }
  
  register(data: DataRegister): Observable<any> {
    return this.httpService.post(this.auth_end_point+'/registrar_usuario', { ...data });
  }

  login(data: DataLogin): Observable<any> {
    return this.httpService.post(this.auth_end_point+'/login', { ...data });
  }

  recover(data: DataRecover): Observable<any> {
    return this.httpService.post(this.auth_end_point+'/recuperar', { ...data});
  }

  recover_password(data: DataRecoverPassword, token: string): Observable<any> {
    return this.httpService.post(this.auth_end_point+'/recover_password?token=' + token, { ...data}); 
  }
}
