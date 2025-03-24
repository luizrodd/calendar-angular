
export interface CalendarEvent {
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

export interface LessonDTO {
  subject: LessonSubject;
  schedules: LessonSchedulesDTO[];
  students: StudentDTO[];
}

export interface LessonSchedulesDTO {
  startTime: string; 
  endTime: string;
  startDate: Date; 
  endDate: Date;
  dayOfWeek: number; 
}

export interface LessonSubject {
  name: string;
  class: string;
  classroom: string;
}

export interface StudentDTO {
  id: string;
  name: string;
  rm: string;
}