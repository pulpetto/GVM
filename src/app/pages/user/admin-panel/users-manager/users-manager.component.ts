import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interfaces/user';

@Component({
    selector: 'app-users-manager',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users-manager.component.html',
    styleUrl: './users-manager.component.css',
})
export class UsersManagerComponent implements OnInit {
    adminService = inject(AdminService);

    users$!: Observable<User[]>;

    ngOnInit() {
        this.users$ = this.adminService.getUsers$();
    }
}
