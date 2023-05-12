import { Shift } from './shift';

describe('Shift', () => {
  it('should create an instance', () => {
    expect(
      new Shift(
        'uniqueName',
        'startDate',
        'startTime',
        'endDate',
        'endTime',
        0,
        'location',
        'description',
        'username'
      )
    ).toBeTruthy();
  });
});
