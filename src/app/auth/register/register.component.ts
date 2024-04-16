import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  // inject son para inyectar herramientas para usarlas dentro del componente.
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);
  //
  
  formRegister = this.toolsForm.group({
    'name': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    'lastName': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    'dni': ['', [Validators.required]],
    'dateOfBirth': ['', [Validators.required]],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(8)]],
    'confirm_password': ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.formRegister.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error'); 
      return;
    }
    this.authService.register({
      name: this.formRegister.get('name')?.value ?? '',
      lastName: this.formRegister.get('lastName')?.value ?? '',
      dni: Number(this.formRegister.get('dni')?.value) ?? 0,
      dateOfBirth: new Date(this.formRegister.get('dateOfBirth')?.value ?? ''),
      email: this.formRegister.get('email')?.value ?? '',
      password: this.formRegister.get('password')?.value ?? '',
      

    }).subscribe({
      next: (value) => {
        console.log(value),
        this.notifycation.success(`Te has registrado correctamente. ${value.name} ${value.lastName} ${value.message} `, 'Éxito');
        this.formRegister.reset();
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        this.notifycation.error(err.message, 'Error');
      }
    })
  }
}
