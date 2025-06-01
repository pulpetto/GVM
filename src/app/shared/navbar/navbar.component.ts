import { Component, computed, inject, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterModule, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    userService = inject(UserService);

    userRole = computed(() => this.userService.getUser()?.role);

    private isXl = window.innerWidth >= 1280;

    @HostListener('window:resize')
    onResize() {
        this.isXl = window.innerWidth >= 1280;
    }

    isXlScreen() {
        return this.isXl;
    }
}
