import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleGroupsModalComponent } from './muscle-groups-modal.component';

describe('MuscleGroupsModalComponent', () => {
  let component: MuscleGroupsModalComponent;
  let fixture: ComponentFixture<MuscleGroupsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleGroupsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuscleGroupsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
