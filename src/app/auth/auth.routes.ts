import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RecoverComponent } from "./recover/recover.component";

export const authRoutes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'recover',
                component: RecoverComponent
            },

        ]
    },
];