import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-achievements-manager',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent],
    templateUrl: './achievements-manager.component.html',
    styleUrl: './achievements-manager.component.css',
})
export class AchievementsManagerComponent {}
