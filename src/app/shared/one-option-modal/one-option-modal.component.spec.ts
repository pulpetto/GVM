import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOptionModalComponent } from './one-option-modal.component';

describe('OneOptionModalComponent', () => {
  let component: OneOptionModalComponent;
  let fixture: ComponentFixture<OneOptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneOptionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OneOptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
