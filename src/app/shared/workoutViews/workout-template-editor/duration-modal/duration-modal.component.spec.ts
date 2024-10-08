import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationModalComponent } from './duration-modal.component';

describe('DurationModalComponent', () => {
  let component: DurationModalComponent;
  let fixture: ComponentFixture<DurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DurationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
