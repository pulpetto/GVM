import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsManagerComponent } from './achievements-manager.component';

describe('AchievementsManagerComponent', () => {
  let component: AchievementsManagerComponent;
  let fixture: ComponentFixture<AchievementsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchievementsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
