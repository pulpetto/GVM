import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleGroupsCreatorComponent } from './muscle-groups-creator.component';

describe('MuscleGroupsCreatorComponent', () => {
  let component: MuscleGroupsCreatorComponent;
  let fixture: ComponentFixture<MuscleGroupsCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleGroupsCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuscleGroupsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
