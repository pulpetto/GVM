import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';

@Component({
    selector: 'app-follow-notification',
    standalone: true,
    imports: [],
    templateUrl: './follow-notification.component.html',
    styleUrl: './follow-notification.component.css',
})
export class FollowNotificationComponent {
    @Input() dateUnix!: number;
    @Input() user!: User;
}
