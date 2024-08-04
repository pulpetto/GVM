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
        path: 'user',
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
                path: 'profile/settings',
                loadComponent: () =>
                    import(
                        './pages/user/profile/settings/settings.component'
                    ).then((component) => component.SettingsComponent),
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
                path: 'workout/editor',
                loadComponent: () =>
                    import(
                        './pages/user/workout/workout-template-editor/workout-template-editor.component'
                    ).then(
                        (component) => component.WorkoutTemplateEditorComponent
                    ),
            },
            {
                path: 'workout/explore',
                loadComponent: () =>
                    import(
                        './pages/user/workout/explore/explore.component'
                    ).then((component) => component.ExploreComponent),
            },
            {
                path: 'workout/:workoutId',
                loadComponent: () =>
                    import(
                        './shared/workoutViews/workout-full-view/workout-full-view.component'
                    ).then((component) => component.WorkoutFullViewComponent),
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
