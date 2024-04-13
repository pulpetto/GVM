import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
    isMenuVisible: boolean = false;
    themesOptionsVisibility: boolean = false;
    lightTheme!: boolean;

    constructor(private themeService: ThemeService) {}

    ngOnInit() {
        this.lightTheme = !this.themeService.mode;
    }

    switchTheme() {
        this.themeService.changeTheme();
        this.lightTheme = !this.themeService.mode;
    }
}
