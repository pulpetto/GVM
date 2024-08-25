import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-motivational-quotes',
    standalone: true,
    imports: [],
    templateUrl: './motivational-quotes.component.html',
    styleUrl: './motivational-quotes.component.css',
})
export class MotivationalQuotesComponent implements OnInit {
    quotes: string[] = [
        'Great job! Every rep counts—keep pushing towards your goals!',
        'You showed up and crushed it today. Keep that momentum going!',
        'Pain of discipline or pain of regret—the choice is yours. You chose discipline today!',
        'Remember, progress is progress, no matter how small. Well done!',
        "You're stronger than you think. Keep proving it, one workout at a time!",
        'Consistency is key. Keep showing up, and the results will follow!',
        'Another workout down, another step closer to your goals. Keep it up!',
        'Sweat is just fat crying—way to make it weep today!',
        'You’re unstoppable! Keep challenging yourself and reaching new heights!',
        "Well done! The hard work you're putting in today is the success you'll see tomorrow.",
        'Feel that burn? That’s your body getting stronger. Keep embracing the challenge!',
        'Remember why you started. Keep that fire alive and stay committed!',
        'You’ve got this! Each workout is a victory—celebrate your success today!',
        'The only bad workout is the one that didn’t happen. You made it happen today!',
        'Don’t stop now—you’re building the best version of yourself, one workout at a time!',
    ];

    randomIndex!: number;

    ngOnInit() {
        this.randomIndex = Math.floor(Math.random() * this.quotes.length);
    }
}
