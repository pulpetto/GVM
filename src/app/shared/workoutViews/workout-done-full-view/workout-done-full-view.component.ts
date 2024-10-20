import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { WorkoutDoneFull } from '../../../interfaces/workout/workout-done-full';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';

const visibleModal = { top: '50%' };
const visibleModalLow = { top: '75%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-workout-done-full-view',
    standalone: true,
    imports: [CommonModule, RouterModule, TimeFormatterPipe],
    templateUrl: './workout-done-full-view.component.html',
    styleUrl: './workout-done-full-view.component.css',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
        trigger('openClose4', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModalLow)),
            ]),
            transition(':leave', [
                style(visibleModalLow),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose5', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose6', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class WorkoutDoneFullViewComponent implements OnInit {
    optionsModalVisibility: boolean = false;
    confirmDeleteModalVisibility: boolean = false;
    workoutData!: WorkoutDoneFull;

    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    noSetsDoneExercisesIndexes: Set<number> = new Set();

    ngOnInit() {
        this.workoutData = history.state;

        this.workoutData.exercises.forEach((exercise, i) => {
            if (exercise.sets.every((set) => set.isDone === false))
                this.noSetsDoneExercisesIndexes.add(i);
        });
    }

    navigateToSummary() {
        this.router.navigate(['summary'], {
            relativeTo: this.activatedRoute,
            state: this.workoutData,
        });
    }

    navigateToEditView() {
        this.router.navigate([`user/workout/${this.workoutData.id}/edit`], {
            queryParams: { editView: 'done' },
            state: this.workoutData,
        });
    }

    deleteWorkout() {}
}
