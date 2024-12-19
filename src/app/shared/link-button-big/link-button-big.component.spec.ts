import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkButtonBigComponent } from './link-button-big.component';

describe('LinkButtonBigComponent', () => {
  let component: LinkButtonBigComponent;
  let fixture: ComponentFixture<LinkButtonBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkButtonBigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkButtonBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
