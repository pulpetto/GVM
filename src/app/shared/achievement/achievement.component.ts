import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-achievement',
    standalone: true,
    imports: [],
    templateUrl: './achievement.component.html',
    styleUrl: './achievement.component.css',
})
export class AchievementComponent implements OnInit {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) description!: string;
    @Input({ required: true }) imageUrl!: string;
    @Input({ required: true }) progressCurrent!: number;
    @Input({ required: true }) progressEnd!: number;

    percentageProgress!: number;

    ngOnInit() {
        this.percentageProgress =
            (this.progressCurrent / this.progressEnd) * 100;
    }
}
