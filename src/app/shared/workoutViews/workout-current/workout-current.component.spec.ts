import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutCurrentComponent } from './workout-current.component';

describe('WorkoutCurrentComponent', () => {
  let component: WorkoutCurrentComponent;
  let fixture: ComponentFixture<WorkoutCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutCurrentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
