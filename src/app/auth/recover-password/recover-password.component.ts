import { Component, inject } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)

  formRecoverPassword = this.toolsForm.group({
    'password': ['', [Validators.required, Validators.minLength(8)]],
    'confirm_password': ['', [Validators.required, Validators.minLength(8)]]
  })

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.notifycation.error('Tóken inválido', 'Error');
        this.router.navigateByUrl('/auth/login')
      }
    })
  }

  recoverPassword() {
    if(this.formRecoverPassword.invalid) {
      this.notifycation.error('Debes completas los campos correctamente', 'Error');
      return;
    }

    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      
      this.authService.recover_password({
        password: this.formRecoverPassword.get('password')?.value ?? ''
      }, token).subscribe({
        next: (value) => {
          console.log(value),
          this.notifycation.success(`Se ha cambiado la contraseña de su cuenta. ${value.name} ${value.lastName} ${value.message} `, 'Éxito')
          this.formRecoverPassword.reset();
          this.router.navigateByUrl('auth/login')
        },
        error:(err) => {
          this.notifycation.error(err.message, 'Error');
        }
      })
    })
  }

}
