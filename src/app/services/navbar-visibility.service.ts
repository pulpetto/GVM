import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NavbarVisibilityService {
    visibility = new BehaviorSubject<boolean>(true);
}
