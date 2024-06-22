import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-drop-set',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './drop-set.component.html',
    styleUrl: './drop-set.component.css',
})
export class DropSetComponent {
    weight!: number;
    reps!: number;
    rpe!: number;

    rpeModalVisibility: boolean = false;
}
