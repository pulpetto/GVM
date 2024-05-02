import { Component } from '@angular/core';
import { WorkoutPreviewComponent } from '../../../shared/workout-preview/workout-preview.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [WorkoutPreviewComponent],
})
export class ProfileComponent {}
