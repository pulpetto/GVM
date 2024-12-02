import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'pro',
        loadComponent: () =>
            import('./pages/pro/pro.component').then(
                (component) => component.ProComponent
            ),
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
                path: 'admin',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/admin-panel.component'
                    ).then((component) => component.AdminPanelComponent),
            },
            {
                path: 'admin/users',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/users-manager/users-manager.component'
                    ).then((component) => component.UsersManagerComponent),
            },
            {
                path: 'admin/exercises',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/exercise-manager/exercise-manager.component'
                    ).then((component) => component.ExerciseManagerComponent),
            },
            {
                path: 'admin/exercises/new',
                loadComponent: () =>
                    import(
                        './shared/exercise-creator/exercise-creator.component'
                    ).then((component) => component.ExerciseCreatorComponent),
            },
            {
                path: 'admin/exercises/:id',
                loadComponent: () =>
                    import(
                        './shared/exercise-creator/exercise-creator.component'
                    ).then((component) => component.ExerciseCreatorComponent),
            },
            {
                path: 'admin/muscles',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/muscle-groups-manager/muscle-groups-manager.component'
                    ).then(
                        (component) => component.MuscleGroupsManagerComponent
                    ),
            },
            {
                path: 'admin/equipment',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/equipment-manager/equipment-manager.component'
                    ).then((component) => component.EquipmentManagerComponent),
            },
            {
                path: 'admin/achievements',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/achievements-manager/achievements-manager.component'
                    ).then(
                        (component) => component.AchievementsManagerComponent
                    ),
            },
            {
                path: 'admin/achievements/new',
                loadComponent: () =>
                    import(
                        './pages/user/admin-panel/achievements-manager/achievement-creator/achievement-creator.component'
                    ).then(
                        (component) => component.AchievementCreatorComponent
                    ),
            },
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
                path: 'profile/settings/account',
                loadComponent: () =>
                    import(
                        './pages/user/profile/settings/account/account.component'
                    ).then((component) => component.AccountComponent),
            },
            {
                path: 'profile/calendar',
                loadComponent: () =>
                    import(
                        './pages/user/profile/calendar/calendar.component'
                    ).then((component) => component.CalendarComponent),
            },
            {
                path: 'profile/calendar/:id',
                loadComponent: () =>
                    import(
                        './shared/workoutViews/workout-done-full-view/workout-done-full-view.component'
                    ).then(
                        (component) => component.WorkoutDoneFullViewComponent
                    ),
            },
            {
                path: 'profile/calendar/:id/summary',
                loadComponent: () =>
                    import(
                        './shared/workout-summary/workout-summary.component'
                    ).then((component) => component.WorkoutSummaryComponent),
            },
            {
                path: 'profile/goals',
                loadComponent: () =>
                    import('./pages/user/profile/goals/goals.component').then(
                        (component) => component.GoalsComponent
                    ),
            },
            {
                path: 'profile/history',
                loadComponent: () =>
                    import(
                        './pages/user/profile/history/history.component'
                    ).then((component) => component.HistoryComponent),
            },
            {
                path: 'profile/achievements',
                loadComponent: () =>
                    import(
                        './pages/user/profile/achievements/achievements.component'
                    ).then((component) => component.AchievementsComponent),
            },
            {
                path: 'profile/history/:id',
                loadComponent: () =>
                    import(
                        './shared/workoutViews/workout-done-full-view/workout-done-full-view.component'
                    ).then(
                        (component) => component.WorkoutDoneFullViewComponent
                    ),
            },
            {
                path: 'profile/history/:id/summary',
                loadComponent: () =>
                    import(
                        './shared/workout-summary/workout-summary.component'
                    ).then((component) => component.WorkoutSummaryComponent),
            },
            {
                path: 'profile/exercises',
                loadComponent: () =>
                    import(
                        './pages/user/profile/exercises/exercises.component'
                    ).then((component) => component.ExercisesComponent),
            },
            {
                path: 'profile/exercises/creator',
                loadComponent: () =>
                    import(
                        './shared/exercise-creator/exercise-creator.component'
                    ).then((component) => component.ExerciseCreatorComponent),
            },
            {
                path: 'profile/exercises/:id',
                loadComponent: () =>
                    import('./shared/exercise/exercise.component').then(
                        (component) => component.ExerciseComponent
                    ),
            },
            {
                path: 'profile/statistics',
                loadComponent: () =>
                    import(
                        './pages/user/profile/statistics/statistics.component'
                    ).then((component) => component.StatisticsComponent),
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
                        './shared/workoutViews/workout-template-editor/workout-template-editor.component'
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
            {
                path: 'workout/:workoutId/edit',
                loadComponent: () =>
                    import(
                        './shared/workoutViews/workout-template-editor/workout-template-editor.component'
                    ).then(
                        (component) => component.WorkoutTemplateEditorComponent
                    ),
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
