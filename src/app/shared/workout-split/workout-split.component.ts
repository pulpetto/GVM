import { Component, Input } from '@angular/core';
import { WorkoutMiniPreviewComponent } from '../workoutViews/workout-mini-preview/workout-mini-preview.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-workout-split',
    standalone: true,
    templateUrl: './workout-split.component.html',
    styleUrl: './workout-split.component.css',
    imports: [WorkoutMiniPreviewComponent, CommonModule],
})
export class WorkoutSplitComponent {
    @Input({ required: true }) workoutsNames!: string[];
    isOpen: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateHeight(element: any) {
        element.style.height =
            Array.prototype.reduce.call(
                element.childNodes,
                function (p, c) {
                    return p + (c.offsetHeight || 0);
                },
                0
            ) + 'px';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggleExpand(element: any) {
        if (!element.style.height || element.style.height == '0px') {
            this.calculateHeight(element);
        } else {
            element.style.height = '0px';
        }
    }
}
