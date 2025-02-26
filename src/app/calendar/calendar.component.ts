import { Component, OnInit } from '@angular/core';
import { CalendarService } from './service/calendar.service';
import { CommonModule } from '@angular/common';
import { isWithinInterval } from 'date-fns';

interface Lesson {
  date: Date;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

export enum DayViewEnum{
  Month,
  Week,
  Day
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  events: Lesson[] = [
    {
      date: new Date(),
      title: 'Event 1',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      date: new Date(),
      title: 'Event 2',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      date: new Date(),
      title: 'Event 4',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      date: new Date(),
      title: 'Event 5',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      date: new Date(),
      title: 'Event 6',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      date: new Date(),
      title: 'Event 7',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      title: 'Event 3',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      startTime: '10:00',
      endTime: '12:00',
    },
  ];

  view: DayViewEnum = DayViewEnum.Month;
  DayViewEnum: typeof DayViewEnum = DayViewEnum;
  daysView = ['Month', 'Week', 'Day'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  timeDay: string[] = [];


  daysOfWeeksInMonth: Date[][] = [];
  daysOfWeek: Date[] = [];
  currentDay: Date = new Date();

  constructor(private _service: CalendarService) {}

  ngOnInit() {
    this.timeDay = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    this._service.currentDaysOfMonth$.subscribe((weeks: Date[][]) => {
      this.daysOfWeeksInMonth = weeks;
    });

    this._service.currentDaysOfWeek$.subscribe((week: Date[]) => {
      this.daysOfWeek = week;
    });

    this._service.currentDay$.subscribe((day: Date) => {
      this.currentDay = day;
    });
  }

  isToday(day: Date): boolean {
    return day.toDateString() === new Date().toDateString();
  }

  changeView(event: Event){
    this.view = DayViewEnum[(event.target as HTMLSelectElement).value as keyof typeof DayViewEnum];

    if(this.view === DayViewEnum.Month){
      this._service.updateCurrentMonth(this.currentDay);
    }

    if(this.view === DayViewEnum.Week){
      this._service.updateCurrentWeek(this.currentDay);
    }

    if(this.view === DayViewEnum.Day
    ){
      this._service.updateCurrentDay(this.currentDay);
    }
  }

  nextMonth() {
    this._service.updateCurrentMonth(
      new Date(this.currentDay.setMonth(this.currentDay.getMonth() + 1))
    );
  }

  previousMonth() {
    this._service.updateCurrentMonth(
      new Date(this.currentDay.setMonth(this.currentDay.getMonth() - 1))
    );
  }

  validateIfShowEvent(event: Lesson, day: Date): boolean {
    const start = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate());
    const end = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());
    const current = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    if (isWithinInterval(current, { start, end })) {
      if (day.getDay() === event.date.getDay()) return true;
    }

    return false;
  }

  validateIfShowEventTime(event: Lesson, day: Date, time: string): boolean {
    const timeEvent = event.startTime;
    return timeEvent === time && this.validateIfShowEvent(event, day);
  }

  today() {
    this._service.updateCurrentMonth(new Date());
    this._service.updateCurrentWeek(new Date());
    this._service.updateCurrentDay(new Date());
  }

  nextWeek() {
    this._service.updateCurrentWeek(
      new Date(this.currentDay.setDate(this.currentDay.getDate() + 7))
    );
  }

  previousWeek() {
    this._service.updateCurrentWeek(
      new Date(this.currentDay.setDate(this.currentDay.getDate() - 7))
    );
  }

  nextDay() {
    this._service.updateCurrentDay(
      new Date(this.currentDay.setDate(this.currentDay.getDate() + 1))
    )
  }

  previousDay() {
    this._service.updateCurrentDay(
      new Date(this.currentDay.setDate(this.currentDay.getDate() - 1))
    )
  }

  countOfEventOnMonth(day: Date): number{
    return this.events.filter(event => event.date.toDateString() === day.toDateString()).length;
  }
}
