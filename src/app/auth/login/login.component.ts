import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  //INJECCION DE LAS HERRAMIENTAS
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);
  //

  formLogin = this.toolsForm.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(8)]]
  })

  login() {
    if (this.formLogin.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.authService.login({
      email: this.formLogin.get('email')?.value ?? '',
      password: this.formLogin.get('password')?.value ?? '',
    }).subscribe({
      next: (value) => {
        console.log(value),
        this.notifycation.success(`Has iniciado sesión correctamente. ${value.name} ${value.lastName} ${value.message} `, 'Éxito')
        this.formLogin.reset();
        this.router.navigateByUrl('/pages/home');
      },
      error: (err) => {
        if (err.status === 404) {
          this.notifycation.error('Credenciales incorrectas.', 'Error',);
        } 
        else {
          this.notifycation.error(err.message, 'Error',);
        }
      }
    })
  }
}
