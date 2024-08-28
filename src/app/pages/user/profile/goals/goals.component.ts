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

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.css',
})
export class GoalsComponent implements AfterViewInit {
    cdr = inject(ChangeDetectorRef);

    @ViewChildren('tabButton')
    tabButtons!: QueryList<ElementRef>;

    activeTabName: 'current' | 'done' = 'current';
    tabWidthPx!: number;

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
