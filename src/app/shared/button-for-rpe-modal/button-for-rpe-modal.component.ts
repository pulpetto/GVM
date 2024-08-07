import {
    Component,
    ElementRef,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';
import { RpeType } from '../../types/rpe-type';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-button-for-rpe-modal',
    standalone: true,
    templateUrl: './button-for-rpe-modal.component.html',
    styleUrl: './button-for-rpe-modal.component.css',
    imports: [CommonModule, InfoModalButtonComponent],
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
    ],
})
export class ButtonForRpeModalComponent {
    @Input({ required: true }) rpe!: FormControl<RpeType>;

    modalVisibility: boolean = false;
    rpeScale: (number | 'F')[] = [6, 7, 8, 9, 9.5, 10, 'F'];

    hoveredRpeValue: RpeType = null;
    leftDistancePxHover: number = 0;
    hoverShadowLeftDistancePx: number = 0;

    @ViewChildren('rpeValBtn') rpeValuesButtons!: QueryList<ElementRef>;

    onRpeValueChange(rpeValue: number | 'F', $index: number) {
        if (this.rpe.value === rpeValue) {
            this.rpe.setValue(null);
            this.hoverShadowLeftDistancePx = 0;
        } else {
            this.rpe.setValue(rpeValue);
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
