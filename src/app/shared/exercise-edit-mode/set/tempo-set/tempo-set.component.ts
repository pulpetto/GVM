import { Component, Input } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ReactiveFormsModule } from '@angular/forms';

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
    imports: [NgxMaskDirective, FormsModule, CommonModule, ReactiveFormsModule],
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
    @Input() tempo!: FormGroup;

    phasesNames = [
        'eccentricPhaseLength',
        'isometricPhaseOneLength',
        'concentricPhaseLength',
        'isometricPhaseTwoLength',
    ];
    tempoModalVisibility: boolean = false;
    instructionsModalVisibility: boolean = false;

    get eccentricPhaseLength(): FormControl {
        return this.tempo.get('eccentricPhaseLength') as FormControl;
    }

    get isometricPhaseOneLength(): FormControl {
        return this.tempo.get('isometricPhaseOneLength') as FormControl;
    }

    get concentricPhaseLength(): FormControl {
        return this.tempo.get('concentricPhaseLength') as FormControl;
    }

    get isometricPhaseTwoLength(): FormControl {
        return this.tempo.get('isometricPhaseTwoLength') as FormControl;
    }

    get tempoObjEntries() {
        return Object.entries(this.tempo.controls);
    }
}
