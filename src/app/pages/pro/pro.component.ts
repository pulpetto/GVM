import { Component } from '@angular/core';

@Component({
    selector: 'app-pro',
    standalone: true,
    imports: [],
    templateUrl: './pro.component.html',
    styleUrl: './pro.component.css',
})
export class ProComponent {
    freeFeatures: string[] = [
        'Workout tracking',
        'All exercises with instructions',
        'Workout history with calendar',
    ];

    proFeatures: string[] = [
        'Unlimited workout templates',
        'Unlimited custom exercises',
        'Unlimited exercises per workout',
        'Advanced statistics',
        'Goals tracking',
        'Achievements tracking',
        'Full statistics history',
        'Premium profile badge',
        'Support for GVM development',
    ];
}
