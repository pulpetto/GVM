import { Component, Input, OnInit } from '@angular/core';
import { Achievement } from '../../interfaces/achievement';
import { CommonModule } from '@angular/common';
import { NumberSeparatorPipe } from '../../pipes/number-separator.pipe';

@Component({
    selector: 'app-achievement',
    standalone: true,
    imports: [CommonModule, NumberSeparatorPipe],
    templateUrl: './achievement.component.html',
    styleUrl: './achievement.component.css',
})
export class AchievementComponent implements OnInit {
    @Input({ required: true }) achievement!: Achievement;

    percentageProgress!: number;
    activeTier: number = 0;

    ngOnInit() {
        this.percentageProgress = 55;
    }
}
