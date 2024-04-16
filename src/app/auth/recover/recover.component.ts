import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css'
})
export class RecoverComponent {
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);

  formRecover = this.toolsForm.group({
    'email': ['', [Validators.required, Validators.email]]
  })

  recover() {
    if (this.formRecover.invalid) {
      this.notifycation.error('Debes completar el campo', 'Error');
      return;
    }
    this.authService.recover({
      email: this.formRecover.get('email')?.value ?? '',
    }).subscribe({
      next: (value) => {
        console.log(value),
        this.notifycation.success(`Se ha enviado un correo para la recuperación de su cuenta.`, 'Éxito')
        this.formRecover.reset();
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        if (err.status === 404) {
          this.notifycation.error('Email no encontrado.', 'Error',);
        }
        else {
          this.notifycation.error(err.message, 'Error',)
        }
      }
    })
  }
}
