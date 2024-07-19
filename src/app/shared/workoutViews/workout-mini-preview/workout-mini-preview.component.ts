import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonForModalComponent } from '../../button-for-modal/button-for-modal.component';
import { UserService } from '../../../services/user.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-workout-mini-preview',
    standalone: true,
    templateUrl: './workout-mini-preview.component.html',
    styleUrl: './workout-mini-preview.component.css',
    imports: [RouterModule, ButtonForModalComponent, CommonModule],
})
export class WorkoutMiniPreviewComponent implements OnInit {
    @Input({ required: true }) workoutId!: string;

    userService = inject(UserService);

    workoutName$!: Observable<string>;

    ngOnInit() {
        this.workoutName$ = this.userService
            .getWorkoutById(this.workoutId)
            .pipe(map((workout) => workout.name));
    }

    onMenuClick($event: Event) {
        $event.stopPropagation();
        $event.preventDefault();
    }
}
