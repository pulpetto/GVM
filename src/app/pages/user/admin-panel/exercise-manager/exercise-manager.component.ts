import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-exercise-manager',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './exercise-manager.component.html',
    styleUrl: './exercise-manager.component.css',
})
export class ExerciseManagerComponent {
    adminService = inject(AdminService);
}
