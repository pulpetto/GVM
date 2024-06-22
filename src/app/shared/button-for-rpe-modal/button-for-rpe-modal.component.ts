import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';

@Component({
    selector: 'app-button-for-rpe-modal',
    standalone: true,
    templateUrl: './button-for-rpe-modal.component.html',
    styleUrl: './button-for-rpe-modal.component.css',
    imports: [CommonModule, InfoModalButtonComponent],
})
export class ButtonForRpeModalComponent {
    @Output() rpeValueChangeEvent = new EventEmitter<{
        rpeValue: number;
    }>();

    modalVisibility: boolean = false;

    rpe!: number | null;
    rpeScale = [6, 7, 8, 9, 9.5, 10];

    hoveredRpeValue: number | null = null;
    leftDistancePxHover: number = 0;
    hoverShadowLeftDistancePx: number = 0;

    @ViewChildren('rpeValBtn') rpeValuesButtons!: QueryList<ElementRef>;

    onRpeValueChange(rpeValue: number, $index: number) {
        if (this.rpe === rpeValue) {
            this.rpe = null;
            this.hoverShadowLeftDistancePx = 0;
        } else {
            this.rpe = rpeValue;
            this.hoverShadowLeftDistancePx =
                this.rpeValuesButtons.toArray()[
                    $index
                ].nativeElement.offsetLeft;
        }
    }

    onRpeMouseOver(rpeValue: number, $index: number) {
        this.hoveredRpeValue = rpeValue;

        this.leftDistancePxHover =
            this.rpeValuesButtons.toArray()[$index].nativeElement.offsetLeft;
    }

    onRpeMouseOut() {
        this.hoveredRpeValue = null;
    }
}
