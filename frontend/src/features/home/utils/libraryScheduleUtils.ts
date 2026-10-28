export interface ScheduleDay {
  dayName: string;
  hours: string;
  isSaturday?: boolean;
  isSunday?: boolean;
}

export const LIBRARY_SCHEDULE_DAYS: ScheduleDay[] = [
  { dayName: 'Lunes', hours: '8:00 am – 9:00 pm' },
  { dayName: 'Martes', hours: '8:00 am – 9:00 pm' },
  { dayName: 'Miércoles', hours: '8:00 am – 9:00 pm' },
  { dayName: 'Jueves', hours: '8:00 am – 9:00 pm' },
  { dayName: 'Viernes', hours: '8:00 am – 9:00 pm' },
  { dayName: 'Sábado', hours: '8:00 am – 2:00 pm', isSaturday: true },
  { dayName: 'Domingo', hours: 'Cerrado', isSunday: true },
];

export interface LibraryStatus {
  isOpen: boolean;
  statusLabel: 'ABIERTO' | 'CERRADO';
}

export const getLibraryStatus = (now: Date = new Date()): LibraryStatus => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    });
    const parts = formatter.formatToParts(now);
    let weekdayStr = '';
    let hour = 0;
    let minute = 0;
    for (const part of parts) {
      if (part.type === 'weekday') weekdayStr = part.value;
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    }
    const timeInMinutes = hour * 60 + minute;
    const isSunday = weekdayStr === 'Sun';
    const isSaturday = weekdayStr === 'Sat';
    const isWeekday = !isSunday && !isSaturday;

    let isOpen = false;
    if (isWeekday) {
      isOpen = timeInMinutes >= 8 * 60 && timeInMinutes < 21 * 60;
    } else if (isSaturday) {
      isOpen = timeInMinutes >= 8 * 60 && timeInMinutes < 14 * 60;
    }

    return {
      isOpen,
      statusLabel: isOpen ? 'ABIERTO' : 'CERRADO',
    };
  } catch {
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    const isWeekday = day >= 1 && day <= 5;
    const isSaturday = day === 6;

    let isOpen = false;
    if (isWeekday) {
      isOpen = timeInMinutes >= 8 * 60 && timeInMinutes < 21 * 60;
    } else if (isSaturday) {
      isOpen = timeInMinutes >= 8 * 60 && timeInMinutes < 14 * 60;
    }

    return {
      isOpen,
      statusLabel: isOpen ? 'ABIERTO' : 'CERRADO',
    };
  }
};
