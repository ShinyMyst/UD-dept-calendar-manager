/*
### The syncing process
Speadsheet uses the link column to determine if a corresponding event exists within the Google Calendar.
Google Calendar uses a custom hidden "extendedProperty" boolean to track whether or not it exists within the spreadsheet.

When syncing events unpaired events, the script will look at both of these fields to determine whether or not event exists.
This means duplicate events of the same name are allowed and most be removed manually.

### Multiple calendars
If you want an event to exist in multiple calendars, multiple entries must exist within the spreadsheet.
Each copy of the event will link to its corresponding calendar version of the event

### Entering events on spreadsheet
Fill out whatever fields you want but do NOT touch last edited OR link fields.  These are used internally by the script.
The only date field that MUST be filled out is the start date.  Month can be infered and the end date will match start unless told otherwise.

### Entering events on calendar
Do whatever you want.

### Duplicate Events (written in both locations)
If you put the same event in the Google calendar AND on the spreadsheet, the script will process each as a different event.
You will need to manually delete the duplicate version that you do not want.

### Editing Events
The script will check compare versions of the event on the calendar and on the spreadsheet.
It will prioritize the details written on the most recently updated location.
Spreadsheet edits can be detected as soon as they occur.
Calendar edits occur periodically.

### Row 1 Requirements
UD functions work under the assumption that row 1 includes your heads

### Set-Up
All UD lib files require you to include the sheet url as well as the page name of the page you're looking at and editing.

*/

