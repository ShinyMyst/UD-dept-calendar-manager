# Dept Calendar Manager
Assists with management of Departmental Calendar by adding new dates to the SpreadSheet and Google Calendar.

### Adding Entries
To add entries, users check the box on the Input page of the Calendar Spreadsheet.  Entries with the checkmark will be added to the Calendar Spreadsheet page as well as a Google Calendar.

### Calendar Spreadsheet
When adding events to the Spreadsheet, script will read the input page.  If the event does not already exist, it copies over the data and sorts it based on a date value.  The entry is then deleted from InputSheet if it was added.

Single dates are added as is.  Dates that consist of a singular month are sorted as if they were the 1st day of the month -1 to the date value to put them on the top.  Dates that span a range act a bit differently.  One entry is created with the date range itself listed.  A series of individual events are created as well and given an ID with the event name.  This allows users the choice of viewing only the range or viewing them spread out (as requested).

### Google Calendar
Multiple Google calendars are specified on the Configuration page.  Events are placed based on which Department they are tagged as.  If one of the three main Departments are not specified, it goes into the general calendar intead.  (We wanted to avoid too many calendars so limited it to the main ones.)  Before creating a new event, script checks if event is already added.

### Configuration
Configuration page exists on the Spreadsheet allowing users to easily change variables.  Config page in the script gets its values from there.
