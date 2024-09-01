import { Component } from '@angular/core';
import { AchievementComponent } from '../../../../shared/achievement/achievement.component';

@Component({
    selector: 'app-achievements',
    standalone: true,
    imports: [AchievementComponent],
    templateUrl: './achievements.component.html',
    styleUrl: './achievements.component.css',
})
export class AchievementsComponent {}
