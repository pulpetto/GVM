import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutFullViewComponent } from './workout-full-view.component';

describe('WorkoutFullViewComponent', () => {
  let component: WorkoutFullViewComponent;
  let fixture: ComponentFixture<WorkoutFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutFullViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
