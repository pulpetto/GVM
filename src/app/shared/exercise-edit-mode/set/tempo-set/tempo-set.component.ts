import { Component } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tempo-set',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule, CommonModule],
    templateUrl: './tempo-set.component.html',
    styleUrl: './tempo-set.component.css',
})
export class TempoSetComponent {
    tempo!: {
        eccentricPhaseLength: number;
        isometricPhaseOneLength: number;
        concentricPhaseLength: number;
        isometricPhaseTwoLength: number;
    };

    tempoModalVisibility: boolean = true;

    onTempoValueChange() {}
}
