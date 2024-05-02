import { Component } from '@angular/core';
import { WorkoutPreviewComponent } from '../../../shared/workout-preview/workout-preview.component';
import { CommentComponent } from '../../../shared/comment/comment.component';
import { FollowNotificationComponent } from '../../../shared/follow-notification/follow-notification.component';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [
        WorkoutPreviewComponent,
        CommentComponent,
        FollowNotificationComponent,
        IconButtonComponent,
    ],
})
export class ProfileComponent {}
