import { Component, EventEmitter, Output } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TempoSet } from '../../../../interfaces/tempo-set';
import { trigger, transition, style, animate } from '@angular/animations';

const visibleTempoModal = { top: '50%' };
const hiddenTempoModal = { top: '100%' };

const visibleInstructionsModal = { top: '0%' };
const hiddenInstructionsModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-tempo-set',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule, CommonModule],
    templateUrl: './tempo-set.component.html',
    styleUrl: './tempo-set.component.css',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenTempoModal),
                animate(timing, style(visibleTempoModal)),
            ]),
            transition(':leave', [
                style(visibleTempoModal),
                animate(timing, style(hiddenTempoModal)),
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
                style(hiddenInstructionsModal),
                animate(timing, style(visibleInstructionsModal)),
            ]),
            transition(':leave', [
                style(visibleInstructionsModal),
                animate(timing, style(hiddenInstructionsModal)),
            ]),
        ]),
        trigger('openClose4', [
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
export class TempoSetComponent {
    @Output() tempoChangeEvent = new EventEmitter<TempoSet>();

    tempo: TempoSet = {
        eccentricPhaseLength: null,
        isometricPhaseOneLength: null,
        concentricPhaseLength: null,
        isometricPhaseTwoLength: null,
    };

    get tempoObjEntries() {
        return Object.entries(this.tempo);
    }

    tempoModalVisibility: boolean = false;
    instructionsModalVisibility: boolean = false;

    onTempoValueChange() {
        this.tempoChangeEvent.emit(this.tempo);
    }
}
