import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css',
})
export class AccountComponent {}
