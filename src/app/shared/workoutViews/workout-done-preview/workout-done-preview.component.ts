import { Component, inject, Input } from '@angular/core';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkoutDoneFull } from '../../../interfaces/workout/workout-done-full';

@Component({
    selector: 'app-workout-done-preview',
    standalone: true,
    imports: [TimeFormatterPipe, RouterModule],
    templateUrl: './workout-done-preview.component.html',
    styleUrl: './workout-done-preview.component.css',
})
export class WorkoutDonePreviewComponent {
    @Input({ required: true }) workoutData!: WorkoutDoneFull;

    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    navigateToFullView() {
        this.router.navigate([this.workoutData.id], {
            relativeTo: this.activatedRoute,
            state: this.workoutData,
        });
    }
}
