import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../../../interfaces/exercise';

@Component({
    selector: 'app-exercise-manager',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './exercise-manager.component.html',
    styleUrl: './exercise-manager.component.css',
})
export class ExerciseManagerComponent implements OnInit {
    adminService = inject(AdminService);

    exercises$!: Observable<Exercise[]>;

    ngOnInit() {
        this.exercises$ = this.adminService.getExercises();
    }
}
