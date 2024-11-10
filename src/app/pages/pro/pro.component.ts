import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-pro',
    standalone: true,
    imports: [CommonModule],
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

    freeFeaturesLimits: string[] = [
        '4 max',
        '6 max',
        '7 max',
        'Basic',
        'x',
        'x',
        'x',
        'x',
        '😢',
    ];

    reviews: {
        username: string;
        pfpImgUrlPreview: string;
        stars: number;
        review: string;
    }[] = [
        {
            username: 'Cbum',
            pfpImgUrlPreview:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcf8myal8KluaMT7mvwl3YDSaYISFLCghmzKOplhkO9pe_HUUdvlZqn5NB5ipL4ePH3zw&usqp=CAU',
            stars: 5,
            review: "Amazing app! It's so easy to track my progress and see how far I've come. Love the charts feature!",
        },
        {
            username: 'Tom Platz',
            pfpImgUrlPreview:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlAiaaabc-wNV4HFkllqGhYhJ-d7hBbsYVGg&s',
            stars: 5,
            review: 'The exercise library and workout history are super helpful! Keeps me motivated to reach my goals.',
        },
        {
            username: 'Kevin Levrone',
            pfpImgUrlPreview:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5O7TnG8RZP_2c9HnaTe-WvsBmLLtpVU6XikwfHTU_8xhx1WNDO0tUzxwHrKf8lxg5ptg&usqp=CAU',
            stars: 4,
            review: 'I love the design and functionality. The progress tracking has really helped me improve my lifts.',
        },
        {
            username: 'Arnold',
            pfpImgUrlPreview:
                'https://www.budujmase.pl/wp-content/uploads/jak-osi%C4%85gn%C4%85%C4%87-sukces-w-kulturystyce-wg-arnolda-schwarzenegger-a-80-1418151635-1.jpg',
            stars: 5,
            review: 'This app has everything I need to stay on track! Great for both beginners and experienced lifters.',
        },
        {
            username: 'Ronnie Coleman',
            pfpImgUrlPreview:
                'https://ronnicoleman.com/wp-content/uploads/2024/03/Ronnie-Coleman-Bodybuilding-Pose-1022x1024.png',
            stars: 4,
            review: 'Fantastic app with a lot of useful features! The stats and charts are perfect for tracking gains.',
        },
    ];
}
