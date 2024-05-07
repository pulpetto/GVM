import { Component } from '@angular/core';
import { OneOptionModalComponent } from '../../../../shared/one-option-modal/one-option-modal.component';
import { FollowNotificationComponent } from '../../../../shared/follow-notification/follow-notification.component';
import { CommentComponent } from '../../../../shared/comment/comment.component';
import { ButtonForModalComponent } from '../../../../shared/button-for-modal/button-for-modal.component';
import { WorkoutDonePreviewComponent } from '../../../../shared/workoutViews/workout-done-preview/workout-done-preview.component';

@Component({
    selector: 'app-recent',
    standalone: true,
    templateUrl: './recent.component.html',
    styleUrl: './recent.component.css',
    imports: [
        OneOptionModalComponent,
        FollowNotificationComponent,
        CommentComponent,
        ButtonForModalComponent,
        WorkoutDonePreviewComponent,
    ],
})
export class RecentComponent {
    activeTabName: string = 'workout';

    activeTabChange() {}
}
