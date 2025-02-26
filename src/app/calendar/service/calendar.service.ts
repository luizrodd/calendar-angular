import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { eachDayOfInterval } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}

  private _currentDay: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  private _currentDaysOfWeek: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  private _currentDaysOfMonth: BehaviorSubject<Date[][]> = new BehaviorSubject<Date[][]>([]);

  get currentDay$(): Observable<Date> {
    return this._currentDay.asObservable();
  }

  get currentDaysOfMonth$(): Observable<Date[][]> {
    return this._currentDaysOfMonth.asObservable();
  }

  get currentDaysOfWeek$(): Observable<Date[]> {
    return this._currentDaysOfWeek.asObservable();
  }

  getCurrentDay(): Date {
    return this._currentDay.value;
  }

  private getMonthRange(date: Date): { start: Date; end: Date } {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return { start, end };
  }

  private getWeekRange(date: Date): { start: Date; end: Date } {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return { start, end };
  }

  private getDaysOfMonth(date: Date): Date[][] {
    const { start, end } = this.getMonthRange(date);

    const startDate = startOfWeek(start, { weekStartsOn: 0 });
    const endDate = endOfWeek(end, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  private getDaysOfWeek(date: Date): Date[] {
    const { start, end } = this.getWeekRange(date);
    return eachDayOfInterval({ start, end });
  }

  updateCurrentMonth(date: Date) {
    const weeks = this.getDaysOfMonth(date);
    this._currentDaysOfMonth.next(weeks);
    this._currentDay.next(date);
  }

  updateCurrentWeek(date: Date) {
    const days = this.getDaysOfWeek(date);
    this._currentDaysOfWeek.next(days);
    this._currentDay.next(date);
  }

  updateCurrentDay(date: Date) {
    this._currentDay.next(date);
  }

}
