import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-activity-bar',
    standalone: true,
    imports: [],
    templateUrl: './activity-bar.component.html',
    styleUrl: './activity-bar.component.css',
})
export class ActivityBarComponent {
    @Input({ required: true }) title!: string;
}
