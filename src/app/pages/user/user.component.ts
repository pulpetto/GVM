import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../shared/activity-bar/activity-bar.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
    imports: [ActivityBarComponent, NavbarComponent, RouterOutlet],
})
export class UserComponent {}
