import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Exercise } from '../../../../interfaces/exercise';
import { GoalComponent } from './goal/goal.component';
import { NgxMaskDirective } from 'ngx-mask';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [CommonModule, GoalComponent, NgxMaskDirective],
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.css',
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
export class GoalsComponent implements AfterViewInit {
    cdr = inject(ChangeDetectorRef);

    @ViewChildren('tabButton')
    tabButtons!: QueryList<ElementRef>;

    activeTabName: 'current' | 'done' = 'current';
    tabWidthPx!: number;

    currentGoals = [1, 2, 3];
    doneGoals = [];

    newGoalModalVisibility: boolean = false;
    selectedExercise: Exercise | null = null;

    ngAfterViewInit() {
        this.tabWidthPx =
            this.tabButtons.toArray()[0].nativeElement.clientWidth;

        this.cdr.detectChanges();
    }

    switchTab(tabName: string) {
        this.activeTabName = tabName as 'current' | 'done';
    }
}
