import { Component } from '@angular/core';
import { InputComponent } from '../../../../shared/input/input.component';

@Component({
    selector: 'app-exercises',
    standalone: true,
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.css',
    imports: [InputComponent],
})
export class ExercisesComponent {}
