import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsChartComponent } from './shifts-chart.component';

describe('ShiftsChartComponent', () => {
  let component: ShiftsChartComponent;
  let fixture: ComponentFixture<ShiftsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftsChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
