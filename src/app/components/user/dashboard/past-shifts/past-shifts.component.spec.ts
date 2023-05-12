import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastShiftsComponent } from './past-shifts.component';

describe('PastShiftsComponent', () => {
  let component: PastShiftsComponent;
  let fixture: ComponentFixture<PastShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastShiftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
