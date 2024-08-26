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

    leftDistancePxHover: number = 0;
    activeOptionIndex: number | null = null;
    activeOptionWidthPx!: number;
    leftDistancePxActive: number = 0;
    hoverOptionIndex: number | null = null;
    hoverOptionWidthPx!: number;

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

    onWorkloadOptionsMouseOver(index: number) {
        this.hoverOptionIndex = index;

        this.leftDistancePxHover =
            this.workloadOptionButtons.toArray()[
                index
            ].nativeElement.offsetLeft;

        this.hoverOptionWidthPx =
            this.workloadOptionButtons.toArray()[
                index
            ].nativeElement.clientWidth;
    }

    onWorkloadOptionsMouseOut() {
        this.hoverOptionIndex = null;
    }
}
