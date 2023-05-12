export class Shift {
  uniqueName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  wage: number = 0;
  location: string;
  description: string;
  username?: string;

  constructor(
    uniqueName: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    wage: number = 0,
    location: string,
    description: string,
    username?: string
  ) {
    this.uniqueName = uniqueName;
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
    this.wage = wage;
    this.location = location;
    this.description = description;
    this.username = username;
  }

  shiftStartDate(): Date {
    return new Date(this.startDate + ' ' + this.startTime);
  }

  shiftEndDate(): Date {
    return new Date(this.endDate + ' ' + this.endTime);
  }

  shiftDuration(): number {
    return this.shiftEndDate().getTime() - this.shiftStartDate().getTime();
  }

  shiftDurationHours(): number {
    return this.shiftDuration() / (1000 * 60 * 60);
  }

  getUniqueName(): string {
    return this.uniqueName;
  }

  totalShiftWage(): number {
    return this.wage * this.shiftDurationHours();
  }
}
