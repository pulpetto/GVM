import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../shared/activity-bar/activity-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
    imports: [ActivityBarComponent, RouterOutlet],
})
export class UserComponent {}
