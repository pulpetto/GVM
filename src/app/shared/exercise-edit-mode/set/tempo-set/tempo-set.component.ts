import { Component } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tempo-set',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule],
    templateUrl: './tempo-set.component.html',
    styleUrl: './tempo-set.component.css',
})
export class TempoSetComponent {
    eccentricPhaseLength = 0;
    isometricPhaseOneLength = 0;
    concentricPhaseLength = 0;
    isometricPhaseTwoLength = 0;

    tempoModalVisibility: boolean = false;

    onTempoValueChange() {}
}
