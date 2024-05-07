import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDonePreviewComponent } from './workout-done-preview.component';

describe('WorkoutDonePreviewComponent', () => {
  let component: WorkoutDonePreviewComponent;
  let fixture: ComponentFixture<WorkoutDonePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDonePreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutDonePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
