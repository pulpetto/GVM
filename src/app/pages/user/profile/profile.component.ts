import { Component } from '@angular/core';
import { WorkoutPreviewComponent } from '../../../shared/workout-preview/workout-preview.component';
import { CommentComponent } from '../../../shared/comment/comment.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [WorkoutPreviewComponent, CommentComponent],
})
export class ProfileComponent {}
