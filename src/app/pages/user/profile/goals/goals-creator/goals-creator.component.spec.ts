import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsCreatorComponent } from './goals-creator.component';

describe('GoalsCreatorComponent', () => {
  let component: GoalsCreatorComponent;
  let fixture: ComponentFixture<GoalsCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
