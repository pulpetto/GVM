import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../shared/activity-bar/activity-bar.component';
import { LinkButtonBigComponent } from '../../../shared/link-button-big/link-button-big.component';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [RouterModule, ActivityBarComponent, LinkButtonBigComponent],
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {}
