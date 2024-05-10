import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutSplitComponent } from './workout-split.component';

describe('WorkoutSplitComponent', () => {
  let component: WorkoutSplitComponent;
  let fixture: ComponentFixture<WorkoutSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutSplitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
