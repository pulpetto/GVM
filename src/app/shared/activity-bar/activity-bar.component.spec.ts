import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBarComponent } from './activity-bar.component';

describe('ActivityBarComponent', () => {
  let component: ActivityBarComponent;
  let fixture: ComponentFixture<ActivityBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
