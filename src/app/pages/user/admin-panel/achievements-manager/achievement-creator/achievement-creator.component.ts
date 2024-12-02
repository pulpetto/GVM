import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-achievement-creator',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent],
    templateUrl: './achievement-creator.component.html',
    styleUrl: './achievement-creator.component.css',
})
export class AchievementCreatorComponent {}
