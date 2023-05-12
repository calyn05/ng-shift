import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersPastShiftsComponent } from './workers-past-shifts.component';

describe('WorkersPastShiftsComponent', () => {
  let component: WorkersPastShiftsComponent;
  let fixture: ComponentFixture<WorkersPastShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkersPastShiftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkersPastShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
