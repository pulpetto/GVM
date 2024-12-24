import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { WorkoutTemplateFull } from '../../interfaces/workout/workout-template-full';
import { WorkoutTemplatePreviewComponent } from '../workoutViews/workout-template-preview/workout-template-preview.component';
import { WorkoutSplitFull } from '../../interfaces/workout-split-full';

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
    imports: [
        CommonModule,
        FormsModule,
        CdkDrag,
        CdkDropList,
        WorkoutTemplatePreviewComponent,
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
        trigger('dropdownToggle', [
            transition(':enter', [
                style(hiddenBg),
                animate('0.2s cubic-bezier(0.4, 0, 0.2, 1)', style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate('0.2s cubic-bezier(0.4, 0, 0.2, 1)', style(hiddenBg)),
            ]),
        ]),
    ],
})
export class WorkoutSplitComponent {
    @Input({ required: true }) splitData!: WorkoutSplitFull;

    userService = inject(UserService);

    isOpen: boolean = false;
    optionsModalVisibility: boolean = false;

    newSplitName: string = '';
    newSplitNameModalVisibility: boolean = false;

    changeSplitName() {
        this.userService.changeSplitName(this.splitData.id, this.newSplitName);
        this.closeNewSplitNameModal();
        this.optionsModalVisibility = false;
    }

    closeNewSplitNameModal() {
        this.newSplitNameModalVisibility = false;
        this.newSplitName = '';
    }

    removeSplit() {
        this.userService.removeWorkoutSplit(this.splitData.id);

        this.optionsModalVisibility = false;
    }

    changeWorkoutsTemplatesOrder(
        event: CdkDragDrop<
            {
                index: number;
                template: WorkoutTemplateFull;
            }[]
        >
    ) {
        this.userService.changeWorkoutsTemplatesOrder(event, this.splitData.id);
    }
}
