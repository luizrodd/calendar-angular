import { Component, OnInit } from '@angular/core';
import { CalendarService } from './service/calendar.service';
import { CommonModule } from '@angular/common';
import { isWithinInterval } from 'date-fns';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CalendarDetailsComponent } from './calendar-details/calendar-details.component';
import { LessonDTO, DayViewEnum, type CalendarEvent } from './calendar.interface';


@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];

  view: DayViewEnum = DayViewEnum.Month;
  DayViewEnum: typeof DayViewEnum = DayViewEnum;
  daysView = ['Month', 'Week', 'Day'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  timeDay: string[] = [];

  classColors: { class: string, color: string }[] = [
    { class: '1 Série', color: '#FF0000' },
    { class: '2 Série', color: '#00FF00' },
    { class: '3 Série', color: '#0000FF' },
    { class: '1 Ano', color: '#FFFF00' },
    { class: '2 Ano', color: '#00FFFF' },
    { class: '3 Ano', color: '#FF00FF' },
    { class: '4 Ano', color: '#000000' },
    { class: '5 Ano', color: '#FFFFFF' }
  ]


  daysOfWeeksInMonth: Date[][] = [];
  daysOfWeek: Date[] = [];
  currentDay: Date = new Date();

  constructor(private _service: CalendarService, private _dialog: MatDialog) {}

  ngOnInit() {
    this.timeDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    this._service.currentDaysOfMonth$.subscribe((weeks: Date[][]) => {
      this.daysOfWeeksInMonth = weeks;
    });

    this._service.currentDaysOfWeek$.subscribe((week: Date[]) => {
      this.daysOfWeek = week;
    });

    this._service.currentDay$.subscribe((day: Date) => {
      this.currentDay = day;
    });

    this._service.get().subscribe((events: LessonDTO[]) => {
      this.events = events.flatMap((data) => {
        return data.schedules.map((schedule) => {
          return {
            date: schedule.startDate,
            title: data.subject.name + ' ' + data.subject.class + ' ' + data.subject.classroom,
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          };
        });
      });
    })
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

  validateIfShowEvent(event: CalendarEvent, day: Date): boolean {
    const start = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate());
    const end = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());
    const current = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    if (isWithinInterval(current, { start, end })) {
      if (day.getDay() === event.date.getDay()) return true;
    }

    return false;
  }

  validateIfShowEventTime(event: CalendarEvent, day: Date, time: string): boolean {
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

  getClassColor(title: string): string{
    const classColor = this.classColors.find(c => title.includes(c.class));
    return classColor ? classColor.color : '#FFFFFF';
  }

  openDetailsDialog(event: CalendarEvent){
    this._dialog.open(CalendarDetailsComponent, 
      {
        data: {
          event: event
        },
        width: '500px',
        height: '500px',
      },
    )
  }
}
