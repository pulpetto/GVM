import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsModalComponent } from './credentials-modal.component';

describe('CredentialsModalComponent', () => {
  let component: CredentialsModalComponent;
  let fixture: ComponentFixture<CredentialsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CredentialsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
