import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feedback',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
    @ViewChildren('workloadOptionBtn')
    workloadOptionButtons!: QueryList<ElementRef>;

    activeOptionIndex: number | null = null;
    activeOptionWidthPx!: number;
    leftDistancePxActive: number = -100;

    workloadOptions: string[] = [
        'Not a challenge, too light',
        'Intense, but manageable',
        'Too much, over my limit',
    ];

    onWorkloadOptionChange(index: number) {
        if (index === this.activeOptionIndex) {
            this.activeOptionIndex = null;
        } else {
            this.activeOptionIndex = index;
            this.activeOptionWidthPx =
                this.workloadOptionButtons.toArray()[
                    index
                ].nativeElement.clientWidth;

            this.leftDistancePxActive =
                this.workloadOptionButtons.toArray()[
                    index
                ].nativeElement.offsetLeft;
        }
    }
}
