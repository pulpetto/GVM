import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExercisePreview } from '../../../../interfaces/exercise-preview';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-exercise-manager',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
    templateUrl: './exercise-manager.component.html',
    styleUrl: './exercise-manager.component.css',
})
export class ExerciseManagerComponent implements OnInit {
    adminService = inject(AdminService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    exercises$!: Observable<ExercisePreview[]>;

    ngOnInit() {
        this.exercises$ = this.adminService.getExercisesPreviews$();
    }

    redirectToExerciseRoute(data: ExercisePreview) {
        this.router.navigate([data.id], {
            relativeTo: this.activatedRoute,
            state: { previewData: data },
        });
    }
}
