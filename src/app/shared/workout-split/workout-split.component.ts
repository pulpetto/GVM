import { Component, inject, Input } from '@angular/core';
import { WorkoutMiniPreviewComponent } from '../workoutViews/workout-mini-preview/workout-mini-preview.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-workout-split',
    standalone: true,
    templateUrl: './workout-split.component.html',
    styleUrl: './workout-split.component.css',
    imports: [WorkoutMiniPreviewComponent, CommonModule, FormsModule],
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
export class WorkoutSplitComponent {
    @Input({ required: true }) splitName!: string;
    @Input({ required: true }) splitId!: string;
    @Input({ required: true }) workoutsIds!: string[];

    userService = inject(UserService);

    isOpen: boolean = false;
    optionsModalVisibility: boolean = true;

    newSplitName: string = '';
    newSplitNameModalVisibility: boolean = false;

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

    openOptionsModal() {
        this.optionsModalVisibility = true;
    }

    changeSplitName() {
        this.userService.changeSplitName(this.splitId, this.newSplitName);
        this.closeNewSplitNameModal();
    }

    closeNewSplitNameModal() {
        this.newSplitNameModalVisibility = false;
        this.newSplitName = '';
    }

    removeSplit() {
        this.userService.removeWorkoutSplit(this.splitId);
    }
}
