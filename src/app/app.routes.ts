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
    {
        path: 'user/:id',
        loadComponent: () =>
            import('./pages/user/user.component').then(
                (component) => component.UserComponent
            ),
        children: [
            {
                path: 'profile',
                loadComponent: () =>
                    import('./pages/user/profile/profile.component').then(
                        (component) => component.ProfileComponent
                    ),
            },
            {
                path: 'profile/calendar',
                loadComponent: () =>
                    import(
                        './pages/user/profile/calendar/calendar.component'
                    ).then((component) => component.CalendarComponent),
            },
            {
                path: 'profile/exercises',
                loadComponent: () =>
                    import(
                        './pages/user/profile/exercises/exercises.component'
                    ).then((component) => component.ExercisesComponent),
            },
            {
                path: 'profile/exercises/:ecerciseName',
                loadComponent: () =>
                    import('./shared/exercise/exercise.component').then(
                        (component) => component.ExerciseComponent
                    ),
            },
            {
                path: 'workout',
                loadComponent: () =>
                    import('./pages/user/workout/workout.component').then(
                        (component) => component.WorkoutComponent
                    ),
            },
            {
                path: 'workout/creator',
                loadComponent: () =>
                    import(
                        './pages/user/workout/creator/creator.component'
                    ).then((component) => component.CreatorComponent),
            },
            {
                path: 'workout/:name',
                loadComponent: () =>
                    import(
                        './pages/user/workout/workout-details/workout-details.component'
                    ).then((component) => component.WorkoutDetailsComponent),
            },
        ],
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
