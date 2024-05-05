import { Component } from '@angular/core';
import { OneOptionModalComponent } from '../../../../shared/one-option-modal/one-option-modal.component';
import { WorkoutPreviewComponent } from '../../../../shared/workout-preview/workout-preview.component';
import { FollowNotificationComponent } from '../../../../shared/follow-notification/follow-notification.component';
import { CommentComponent } from '../../../../shared/comment/comment.component';

@Component({
    selector: 'app-recent',
    standalone: true,
    templateUrl: './recent.component.html',
    styleUrl: './recent.component.css',
    imports: [
        OneOptionModalComponent,
        WorkoutPreviewComponent,
        FollowNotificationComponent,
        CommentComponent,
    ],
})
export class RecentComponent {
    modalVisibility: boolean = false;

    tabChange() {}
}
