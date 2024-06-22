import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterSetComponent } from './cluster-set.component';

describe('ClusterSetComponent', () => {
  let component: ClusterSetComponent;
  let fixture: ComponentFixture<ClusterSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClusterSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
