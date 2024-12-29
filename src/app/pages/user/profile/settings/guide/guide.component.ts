import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-guide',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent],
    templateUrl: './guide.component.html',
    styleUrl: './guide.component.css',
})
export class GuideComponent {}
