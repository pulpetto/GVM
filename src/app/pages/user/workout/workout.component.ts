import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { WorkoutSplitComponent } from '../../../shared/workout-split/workout-split.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { WorkoutSplit } from '../../../interfaces/workout-split';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragDrop,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ActivityBarComponent } from '../../../shared/activity-bar/activity-bar.component';
import { LinkButtonBigComponent } from '../../../shared/link-button-big/link-button-big.component';

const visibleModalTop0 = { top: '0%' };
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
        WorkoutSplitComponent,
        RouterModule,
        CommonModule,
        FormsModule,
        CdkDropListGroup,
        CdkDropList,
        CdkDrag,
        ActivityBarComponent,
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
        trigger('openClose4', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModalTop0)),
            ]),
            transition(':leave', [
                style(visibleModalTop0),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
    ],
})
export class WorkoutComponent implements OnInit {
    userService = inject(UserService);
    destroyRef = inject(DestroyRef);

    proPlan = computed(() => this.userService.getUser()?.pro);

    newSplitNameModalVisibility: boolean = false;
    newSplitName: string = '';

    workoutsSplits$!: Observable<WorkoutSplit[]>;

    splitsReorderModalVisibility: boolean = false;

    ngOnInit() {
        this.userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
                if (user) {
                    this.workoutsSplits$ = this.userService.getWorkoutsSplits();
                }
            });
    }

    closeNewSplitNameModal() {
        this.newSplitNameModalVisibility = false;
        this.newSplitName = '';
    }

    addNewSplit() {
        this.userService.addNewSplit(this.newSplitName);
        this.closeNewSplitNameModal();
    }

    drop(event: CdkDragDrop<WorkoutSplit[]>) {
        moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );

        this.userService.batchSplits(event.container.data);
    }
}
