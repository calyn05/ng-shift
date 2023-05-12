import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditShiftComponent } from './admin-edit-shift.component';

describe('AdminEditShiftComponent', () => {
  let component: AdminEditShiftComponent;
  let fixture: ComponentFixture<AdminEditShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
