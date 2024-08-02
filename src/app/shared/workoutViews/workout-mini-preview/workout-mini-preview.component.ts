import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonForModalComponent } from '../../button-for-modal/button-for-modal.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-workout-mini-preview',
    standalone: true,
    templateUrl: './workout-mini-preview.component.html',
    styleUrl: './workout-mini-preview.component.css',
    imports: [RouterModule, ButtonForModalComponent, CommonModule],
})
export class WorkoutMiniPreviewComponent {
    @Input({ required: true }) workoutId!: string;
    @Input({ required: true }) workoutName!: string;
    @Input({ required: true }) splitId!: string;

    onMenuClick($event: Event) {
        $event.stopPropagation();
        $event.preventDefault();
    }
}
