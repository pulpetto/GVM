import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login.component').then(
                (component) => component.LoginComponent
            ),
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./pages/signup/signup.component').then(
                (component) => component.SignupComponent
            ),
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '**',
        pathMatch: 'full',
        loadComponent: () =>
            import('./pages/not-found/not-found.component').then(
                (component) => component.NotFoundComponent
            ),
    },
];
