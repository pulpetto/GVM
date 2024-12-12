import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-workout-mini-preview',
    standalone: true,
    templateUrl: './workout-mini-preview.component.html',
    styleUrl: './workout-mini-preview.component.css',
    imports: [RouterModule, CommonModule],
})
export class WorkoutMiniPreviewComponent {
    @Input({ required: true }) workoutId!: string;
    @Input({ required: true }) workoutName!: string;
    @Input({ required: true }) splitId!: string;
}
