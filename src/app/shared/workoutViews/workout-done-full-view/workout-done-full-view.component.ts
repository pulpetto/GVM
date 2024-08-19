import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ChartsCarouselComponent } from '../../charts-carousel/charts-carousel.component';
import { RouterModule } from '@angular/router';
import { WorkoutDoneWithId } from '../../../interfaces/workout/workout-done-with-id';

@Component({
    selector: 'app-workout-done-full-view',
    standalone: true,
    imports: [CommonModule, ChartsCarouselComponent, RouterModule],
    templateUrl: './workout-done-full-view.component.html',
    styleUrl: './workout-done-full-view.component.css',
})
export class WorkoutDoneFullViewComponent implements OnInit {
    optionsModalVisibility: boolean = false;
    confirmDeleteModalVisibility: boolean = false;
    workoutData!: WorkoutDoneWithId;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.workoutData = history.state;
    }

    deleteWorkout() {}
}
