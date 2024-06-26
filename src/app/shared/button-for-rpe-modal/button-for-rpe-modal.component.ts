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
import { RpeType } from '../../types/rpe-type';

@Component({
    selector: 'app-button-for-rpe-modal',
    standalone: true,
    templateUrl: './button-for-rpe-modal.component.html',
    styleUrl: './button-for-rpe-modal.component.css',
    imports: [CommonModule, InfoModalButtonComponent],
})
export class ButtonForRpeModalComponent {
    @Output() rpeValueChangeEvent = new EventEmitter<RpeType>();

    modalVisibility: boolean = false;

    rpe!: RpeType;
    rpeScale: (number | 'F')[] = [6, 7, 8, 9, 9.5, 10, 'F'];

    hoveredRpeValue: RpeType = null;
    leftDistancePxHover: number = 0;
    hoverShadowLeftDistancePx: number = 0;

    @ViewChildren('rpeValBtn') rpeValuesButtons!: QueryList<ElementRef>;

    onRpeValueChange(rpeValue: number | 'F', $index: number) {
        if (this.rpe === rpeValue) {
            this.rpe = null;
            this.rpeValueChangeEvent.emit(null);
            this.hoverShadowLeftDistancePx = 0;
        } else {
            this.rpe = rpeValue;
            this.rpeValueChangeEvent.emit(rpeValue);
            this.hoverShadowLeftDistancePx =
                this.rpeValuesButtons.toArray()[
                    $index
                ].nativeElement.offsetLeft;
        }
    }

    onRpeMouseOver(rpeValue: number | 'F', $index: number) {
        this.hoveredRpeValue = rpeValue;

        this.leftDistancePxHover =
            this.rpeValuesButtons.toArray()[$index].nativeElement.offsetLeft;
    }

    onRpeMouseOut() {
        this.hoveredRpeValue = null;
    }
}
