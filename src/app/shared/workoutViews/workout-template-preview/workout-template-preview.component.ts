import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { WorkoutTemplateFull } from '../../../interfaces/workout/workout-template-full';

@Component({
    selector: 'app-workout-template-preview',
    standalone: true,
    imports: [],
    templateUrl: './workout-template-preview.component.html',
    styleUrl: './workout-template-preview.component.css',
})
export class WorkoutTemplatePreviewComponent {
    @Input({ required: true }) workoutData!: WorkoutTemplateFull;

    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    navigateToFullView() {
        this.router.navigate([this.workoutData.id], {
            relativeTo: this.activatedRoute,
            state: this.workoutData,
        });
    }
}
