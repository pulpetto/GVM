import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModalButtonComponent } from './info-modal-button.component';

describe('InfoModalButtonComponent', () => {
  let component: InfoModalButtonComponent;
  let fixture: ComponentFixture<InfoModalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoModalButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoModalButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
