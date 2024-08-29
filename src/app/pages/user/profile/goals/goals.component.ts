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
import { GoalComponent } from './goal/goal.component';
import { NgxMaskDirective } from 'ngx-mask';
import { GoalsCreatorComponent } from './goals-creator/goals-creator.component';

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [
        CommonModule,
        GoalComponent,
        NgxMaskDirective,
        GoalsCreatorComponent,
    ],
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.css',
})
export class GoalsComponent implements AfterViewInit {
    cdr = inject(ChangeDetectorRef);

    @ViewChildren('tabButton')
    tabButtons!: QueryList<ElementRef>;

    activeTabName: 'current' | 'done' = 'current';
    tabWidthPx!: number;

    currentGoals = [1, 2, 3];
    doneGoals = [];

    ngAfterViewInit() {
        this.tabWidthPx =
            this.tabButtons.toArray()[0].nativeElement.clientWidth;

        this.cdr.detectChanges();
    }

    switchTab(tabName: string) {
        this.activeTabName = tabName as 'current' | 'done';
    }
}
