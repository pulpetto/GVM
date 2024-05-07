import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDoneFullViewComponent } from './workout-done-full-view.component';

describe('WorkoutDoneFullViewComponent', () => {
  let component: WorkoutDoneFullViewComponent;
  let fixture: ComponentFixture<WorkoutDoneFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDoneFullViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutDoneFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
