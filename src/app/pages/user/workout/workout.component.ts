import { Component, inject, OnInit } from '@angular/core';
import { WorkoutMiniPreviewComponent } from '../../../shared/workoutViews/workout-mini-preview/workout-mini-preview.component';
import { WorkoutSplitComponent } from '../../../shared/workout-split/workout-split.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { WorkoutSplit } from '../../../interfaces/workout-split';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-workout',
    standalone: true,
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.css',
    imports: [
        WorkoutMiniPreviewComponent,
        WorkoutSplitComponent,
        RouterModule,
        CommonModule,
        FormsModule,
    ],
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
    ],
})
export class WorkoutComponent implements OnInit {
    userService = inject(UserService);

    newSplitNameModalVisibility: boolean = false;
    newSplitName: string = '';

    workoutsSplits$!: Observable<WorkoutSplit[]>;

    ngOnInit() {
        this.workoutsSplits$ = this.userService.getWorkoutsSplits();
    }

    closeNewSplitNameModal() {
        this.newSplitNameModalVisibility = false;
        this.newSplitName = '';
    }

    addNewSplit() {
        this.userService.addNewSplit(this.newSplitName);
        this.closeNewSplitNameModal();
    }
}
