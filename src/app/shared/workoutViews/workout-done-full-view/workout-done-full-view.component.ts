import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkoutDoneWithId } from '../../../interfaces/workout/workout-done-with-id';
import { animate, style, transition, trigger } from '@angular/animations';

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
    imports: [CommonModule, RouterModule],
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
    workoutData!: WorkoutDoneWithId;

    ngOnInit() {
        this.workoutData = history.state;
    }

    deleteWorkout() {}
}
