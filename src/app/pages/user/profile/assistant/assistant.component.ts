import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-assistant',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent],
    templateUrl: './assistant.component.html',
    styleUrl: './assistant.component.css',
})
export class AssistantComponent {}
