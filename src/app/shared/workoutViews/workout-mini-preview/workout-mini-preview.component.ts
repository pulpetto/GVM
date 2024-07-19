import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonForModalComponent } from '../../button-for-modal/button-for-modal.component';

@Component({
    selector: 'app-workout-mini-preview',
    standalone: true,
    templateUrl: './workout-mini-preview.component.html',
    styleUrl: './workout-mini-preview.component.css',
    imports: [RouterModule, ButtonForModalComponent],
})
export class WorkoutMiniPreviewComponent {
    @Input({ required: true }) workoutId!: string;

    onMenuClick($event: Event) {
        $event.stopPropagation();
        $event.preventDefault();
    }
}
