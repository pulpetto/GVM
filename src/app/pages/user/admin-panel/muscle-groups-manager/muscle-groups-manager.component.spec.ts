import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleGroupsManagerComponent } from './muscle-groups-manager.component';

describe('MuscleGroupsManagerComponent', () => {
  let component: MuscleGroupsManagerComponent;
  let fixture: ComponentFixture<MuscleGroupsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleGroupsManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuscleGroupsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
