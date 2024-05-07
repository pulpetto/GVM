import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutMiniPreviewComponent } from './workout-mini-preview.component';

describe('WorkoutMiniPreviewComponent', () => {
  let component: WorkoutMiniPreviewComponent;
  let fixture: ComponentFixture<WorkoutMiniPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutMiniPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutMiniPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
