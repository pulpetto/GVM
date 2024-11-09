import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRouteButtonComponent } from './previous-route-button.component';

describe('PreviousRouteButtonComponent', () => {
  let component: PreviousRouteButtonComponent;
  let fixture: ComponentFixture<PreviousRouteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousRouteButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviousRouteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
