import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-workout-mini-preview',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './workout-mini-preview.component.html',
    styleUrl: './workout-mini-preview.component.css',
})
export class WorkoutMiniPreviewComponent {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) exercises!: string[];
    @Input({ required: true }) muscleGroups!: string[];
    @Input({ required: true }) equipment!: string[];

    get routeName(): string {
        return this.name.replace(/\s&\s/g, '&');
    }
}
