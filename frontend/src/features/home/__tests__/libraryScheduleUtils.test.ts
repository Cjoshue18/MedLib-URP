import { describe, it, expect } from 'vitest';
import {
  getLibraryStatus,
  LIBRARY_SCHEDULE_DAYS,
} from '../utils/libraryScheduleUtils';

describe('libraryScheduleUtils', () => {
  it('defines 7 days in the schedule configuration', () => {
    expect(LIBRARY_SCHEDULE_DAYS).toHaveLength(7);
    expect(LIBRARY_SCHEDULE_DAYS[0].dayName).toBe('Lunes');
    expect(LIBRARY_SCHEDULE_DAYS[6].isSunday).toBe(true);
  });

  it('indicates open status on Monday at 10:00', () => {
    const monday10am = new Date('2025-06-02T10:00:00-05:00');
    const status = getLibraryStatus(monday10am);

    expect(status.isOpen).toBe(true);
    expect(status.statusLabel).toBe('ABIERTO');
    expect(status.currentDayIndex).toBe(0);
  });

  it('indicates closed status on Monday at 21:05', () => {
    const mondayNight = new Date('2025-06-02T21:05:00-05:00');
    const status = getLibraryStatus(mondayNight);

    expect(status.isOpen).toBe(false);
    expect(status.statusLabel).toBe('CERRADO');
    expect(status.currentDayIndex).toBe(0);
  });

  it('indicates open status on Saturday at 13:00', () => {
    const saturday1pm = new Date('2025-06-07T13:00:00-05:00');
    const status = getLibraryStatus(saturday1pm);

    expect(status.isOpen).toBe(true);
    expect(status.statusLabel).toBe('ABIERTO');
    expect(status.currentDayIndex).toBe(5);
  });

  it('indicates closed status on Saturday at 14:05', () => {
    const saturdayAfternoon = new Date('2025-06-07T14:05:00-05:00');
    const status = getLibraryStatus(saturdayAfternoon);

    expect(status.isOpen).toBe(false);
    expect(status.statusLabel).toBe('CERRADO');
    expect(status.currentDayIndex).toBe(5);
  });

  it('indicates closed status on Sunday at any hour', () => {
    const sundayMorning = new Date('2025-06-08T10:00:00-05:00');
    const status = getLibraryStatus(sundayMorning);

    expect(status.isOpen).toBe(false);
    expect(status.statusLabel).toBe('CERRADO');
    expect(status.currentDayIndex).toBe(6);
  });
});
