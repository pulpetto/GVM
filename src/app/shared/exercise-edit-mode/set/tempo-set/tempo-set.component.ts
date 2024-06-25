import { Component, EventEmitter, Output } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TempoSet } from '../../../../interfaces/tempo-set';

@Component({
    selector: 'app-tempo-set',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule, CommonModule],
    templateUrl: './tempo-set.component.html',
    styleUrl: './tempo-set.component.css',
})
export class TempoSetComponent {
    @Output() tempoChangeEvent = new EventEmitter<TempoSet>();

    tempo: TempoSet = {
        eccentricPhaseLength: null,
        isometricPhaseOneLength: null,
        concentricPhaseLength: null,
        isometricPhaseTwoLength: null,
    };

    tempoModalVisibility: boolean = false;
    instructionsModalVisibility: boolean = false;

    onTempoValueChange() {
        this.tempoChangeEvent.emit(this.tempo);
    }
}
