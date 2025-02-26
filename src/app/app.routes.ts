import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { inject } from '@angular/core';
import { CalendarService } from './calendar/service/calendar.service';

export const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    resolve: {
      view: () => inject(CalendarService).initializeCalendar()
    }
  }
];
