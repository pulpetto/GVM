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
    @Input({ required: true }) progress!: number;

    percentageProgress!: number;
    activeTier: number = 0;

    ngOnInit() {
        if (this.progress === 0) {
            this.activeTier = 0;
            this.percentageProgress = 0;
        } else if (this.progress >= this.achievement.tiers[3].to) {
            this.activeTier = 3;
            this.percentageProgress = 100;
        } else {
            this.achievement.tiers.forEach((tier, i) => {
                if (this.progress >= tier.from && this.progress < tier.to)
                    this.activeTier = i;
            });

            this.percentageProgress = Math.round(
                (this.progress / this.achievement.tiers[this.activeTier].to) *
                    100
            );
        }
    }
}
