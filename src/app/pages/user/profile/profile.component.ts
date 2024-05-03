import { Component } from '@angular/core';
import { WorkoutPreviewComponent } from '../../../shared/workout-preview/workout-preview.component';
import { CommentComponent } from '../../../shared/comment/comment.component';
import { FollowNotificationComponent } from '../../../shared/follow-notification/follow-notification.component';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { CommonModule } from '@angular/common';

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
        CommonModule,
    ],
})
export class ProfileComponent {
    modalVisibility: boolean = false;

    options = [
        {
            name: 'workouts',
            active: true,
        },
        {
            name: 'comments',
            active: false,
        },
        {
            name: 'followers',
            active: false,
        },
    ];

    onActiveTabChange(clickedIndex: number) {
        this.options.find((option) => option.active === true)!.active = false;
        this.options[clickedIndex].active = true;
    }
}
