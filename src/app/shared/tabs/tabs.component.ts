import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.css',
})
export class TabsComponent implements AfterViewInit {
    @Input({ required: true }) tabNames!: string[];

    @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef>;

    cdr = inject(ChangeDetectorRef);

    activeTabIndex: number = 0;
    underlineWidthPx!: number;
    leftDistancePx: number = 0;

    tabChange($index: number) {
        this.activeTabIndex = $index;

        this.underlineWidthPx =
            this.tabButtons.toArray()[$index].nativeElement.clientWidth;

        this.leftDistancePx =
            this.tabButtons.toArray()[$index].nativeElement.offsetLeft;
    }

    ngAfterViewInit() {
        this.underlineWidthPx =
            this.tabButtons.toArray()[0].nativeElement.clientWidth;

        this.cdr.detectChanges();
    }
}
