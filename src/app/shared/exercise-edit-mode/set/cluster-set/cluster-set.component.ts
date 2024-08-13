import {
    Component,
    ElementRef,
    Inject,
    Input,
    QueryList,
    Renderer2,
    ViewChildren,
} from '@angular/core';
import { ButtonForRpeModalComponent } from '../../../button-for-rpe-modal/button-for-rpe-modal.component';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RpeType } from '../../../../types/rpe-type';
import { ReactiveFormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleModal = { top: '75%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-cluster-set',
    standalone: true,
    templateUrl: './cluster-set.component.html',
    styleUrl: './cluster-set.component.css',
    imports: [
        ButtonForRpeModalComponent,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
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
    ],
})
export class ClusterSetComponent {
    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    @Input({ required: true }) clusterset!: FormGroup;

    get rpe(): FormControl<RpeType> {
        return this.clusterset.get('rpe') as FormControl<RpeType>;
    }

    restTimeValue: number | null = null;
    restTimeModalVisibility: boolean = true;
    restTimesScale: number[] = [5, 10, 15, 20, 25, 30];

    hoveredRestTimeValue: number | null = null;
    hoverSquareLeftDistancePx: number = 0;
    hoverSquareShadowLeftDistancePx: number = 0;

    openRestTimeModal() {
        this.restTimeModalVisibility = true;
        this.renderer.addClass(this.document.body, 'overflow-y-hidden');
    }

    closeRestTimeModal() {
        this.restTimeModalVisibility = false;
        this.renderer.removeClass(this.document.body, 'overflow-y-hidden');
    }

    @ViewChildren('restTimeButton')
    restTimesValuesButtons!: QueryList<ElementRef>;

    updateRestTime(restTime: number, $index: number) {
        if (+this.clusterset.get('restTime')?.value === restTime) {
            this.restTimeValue = null;
            this.clusterset.get('restTime')?.setValue(null);

            this.hoverSquareLeftDistancePx = 0;
        } else {
            this.restTimeValue = restTime;
            this.clusterset.get('restTime')?.setValue(restTime);

            this.hoverSquareLeftDistancePx =
                this.restTimesValuesButtons.toArray()[
                    $index
                ].nativeElement.offsetLeft;
        }
    }

    onRestTimeMouseOver(restTime: number, $index: number) {
        this.hoveredRestTimeValue = restTime;

        this.hoverSquareShadowLeftDistancePx =
            this.restTimesValuesButtons.toArray()[
                $index
            ].nativeElement.offsetLeft;
    }

    onRestTimeMouseOut() {
        this.hoveredRestTimeValue = null;
    }
}
