import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementCreatorComponent } from './achievement-creator.component';

describe('AchievementCreatorComponent', () => {
  let component: AchievementCreatorComponent;
  let fixture: ComponentFixture<AchievementCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchievementCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
