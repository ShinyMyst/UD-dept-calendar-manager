/*
UD Constants 
These are the project constants that the udLib relies on for functionaltiy.
They're constant within the scope of a project but vary project to project.
*/

const CALENDARS = {
  'DeptCal': CalendarApp.getCalendarById(getCell('B6')),
  'Operations': CalendarApp.getCalendarById(getCell('B7')),
  'ResLife': CalendarApp.getCalendarById(getCell('B8')),
  'Conferences': CalendarApp.getCalendarById(getCell('B9')),
  'Training': CalendarApp.getCalendarById(getCell('B10')),
  'AVIATE': CalendarApp.getCalendarById(getCell('B11')),
  'Employment': CalendarApp.getCalendarById(getCell('B12')),
  'Experimental': CalendarApp.getCalendarById(getCell('B13'))
}