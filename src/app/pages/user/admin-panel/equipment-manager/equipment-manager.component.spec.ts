import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentManagerComponent } from './equipment-manager.component';

describe('EquipmentManagerComponent', () => {
  let component: EquipmentManagerComponent;
  let fixture: ComponentFixture<EquipmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
