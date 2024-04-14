import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

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
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', pathMatch: 'full', component: NotFoundComponent },
];
