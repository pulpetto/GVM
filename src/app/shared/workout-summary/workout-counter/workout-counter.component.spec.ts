import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutCounterComponent } from './workout-counter.component';

describe('WorkoutCounterComponent', () => {
  let component: WorkoutCounterComponent;
  let fixture: ComponentFixture<WorkoutCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutCounterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
