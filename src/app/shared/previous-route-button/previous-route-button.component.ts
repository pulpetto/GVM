import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-previous-route-button',
    standalone: true,
    imports: [],
    templateUrl: './previous-route-button.component.html',
    styleUrl: './previous-route-button.component.css',
})
export class PreviousRouteButtonComponent {
    location = inject(Location);

    navigateBack() {
        this.location.back();
    }
}
