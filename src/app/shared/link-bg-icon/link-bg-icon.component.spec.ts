import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBgIconComponent } from './link-bg-icon.component';

describe('LinkBgIconComponent', () => {
  let component: LinkBgIconComponent;
  let fixture: ComponentFixture<LinkBgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkBgIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkBgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
