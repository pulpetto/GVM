import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-activity-bar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './activity-bar.component.html',
    styleUrl: './activity-bar.component.css',
})
export class ActivityBarComponent {}
