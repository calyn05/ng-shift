import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerShiftsComponent } from './worker-shifts.component';

describe('WorkerShiftsComponent', () => {
  let component: WorkerShiftsComponent;
  let fixture: ComponentFixture<WorkerShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerShiftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
