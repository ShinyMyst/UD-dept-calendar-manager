// ###################
// Entry Class
// ###################
class SheetEntry {
  constructor() {
    this.entryDict = null;  // <-- REMOVE WHEN POSSIBLE TODO
    this.sheetData = getSheetData()   // All events on page
    this.eventDict = null             // Dict with current event
  };



  // Update the current event dict
  // Returns true if sheet data is valid
  validEvent(eventData){
    this.eventDict = createEventDict(eventData)

    switch (true) {
      // Duplicate Entry
      case (matchEventData(eventData, this.sheetData)):
        console.log("DUPLICATE FOUND")
        return false

      // Add other validation here

      default:
        return true
    }
  };

  // Writes the data for current row onto last row of sheet
  writeRow(){
    // TODO this is essentially the process function.
    // Ideally, stop the start and end dates from being called 30 times.
    // perhaps add a class reference at the top?
  };

  _processInput(){
    this.calendarDict[HEADING['EventID']] = ''
    const START = this.entryDict[HEADING['StartDate']]
    const END = this.entryDict[HEADING['EndDate']]
    if (this.entryDict[HEADING['EndDate']].equals("")){
      END = START
    }

    switch (true) {
      // Singular Month
      case MONTHS.includes(START):
        this._writeSingularMonth(START);
        break;
    
      // Singular Date
      case START.getTime() == END.getTime():
        this._writeSingularDate(START);
        break;
    
      // Date Range
      default:
        this._writeDateRange(START, END);
        break;
    }
  };

  // ========================================
  // ===== Writing and Deleting Entries =====
  // ========================================

  // Writes to the next blank row on to the sheet.
  _populateRow() {
    var lastRow = CalendarSheet.getLastRow();
    var newRow = [];

    for (var heading in this.calendarDict){
      newRow.push(this.calendarDict[heading])
    }

    const columnStart = 1
    const columnEnd = newRow.length
    const amountRows = 1
    CalendarSheet.getRange(lastRow+1, columnStart, amountRows, columnEnd).setValues([newRow])
    var eventName = this.entryDict[HEADING['Event']]
    Logger.log("SHEETS. Calendar Page.  Added Entry " + eventName)
  };

  // ========================================
  // ===== Types of Dates to Write =====
  // ========================================
  _writeSingularMonth(START){
  const date = new Date(`${START} 1, ${new Date().getFullYear()}`);   // Create Date object.
  this.calendarDict[HEADING['DateRange']] = START
  this.calendarDict[HEADING['Sorting']] = date.getTime() - 1
  this._populateRow()
  }

  _writeSingularDate(START){
    this.calendarDict[HEADING['DateRange']] = START
    this.calendarDict[HEADING['Sorting']] = START.getTime()
    this._populateRow()
  };

  _writeDateRange(START, END){
    // Helper function for making a date string
    function createDateString(start, end){
      var startMonth = start.toLocaleString('default', { month: 'long' });
      var endMonth = end.toLocaleString('default', { month: 'long' });
      var startDay = start.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });
      var endDay = end.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });

      const dateString = startMonth + ' ' + startDay + ' - ' + endMonth + ' ' + endDay;
      return dateString;
      };

    // Entries for each individual date
    for (let date = new Date(START); date <= END; date.setDate(date.getDate() + 1)) {
      this.calendarDict[HEADING['EventID']] = this.entryDict[HEADING['Event']]
      this.calendarDict[HEADING['DateRange']] = date
      this.calendarDict[HEADING['Sorting']] = date.getTime()
      this._populateRow()
      }
    // Singular entry for date range
    const dateString = createDateString(START, END)
    this.calendarDict[HEADING['EventID']] = ''
    this.calendarDict[HEADING['DateRange']] = dateString
    this.calendarDict[HEADING['Sorting']] = START.getTime() - 1
    this._populateRow()
  };
};

// ###################
// Helper Functions
// ###################
// Creates and returns a dictionary with all calendar headings as keys.
function createEventDict(entryDict){
  var eventDict = {}
  //CalendarSheet.getRange(CalendarPage['headingRange']).getValues()[0]; // get values returns a list of rows
  const calendarHeadings = CALENDAR_PAGE_RANGE
  // Fill eventDict with matching values
  for (var index in calendarHeadings) {
    var heading = calendarHeadings[index]
    // Add matching data from entry page to eventDict.
    if (entryDict.hasOwnProperty(heading)) {
      eventDict[heading] = entryDict[heading];
    } else {
      eventDict[heading] = ''
    }
  }
  return eventDict
};

// REFACTOR REFERENCES TO BE FLUID INSTEAD OF HARDCODED TODO
// Get all existing entries
// Make sure data matches the ones called in event data
function getSheetData() {
  const headerRow = 1; // Assuming the header row is the first row
  const headers = CalendarSheet.getRange(headerRow, 1, 1, CalendarSheet.getLastColumn()).getValues()[0];

  const dateIndex = headers.indexOf('Tentative Dates');
  const eventNameIndex = headers.indexOf('Event');
  const departmentIndex = headers.indexOf('Department');

  const dataRange = CalendarSheet.getRange(headerRow + 1, 1, CalendarSheet.getLastRow() - headerRow, CalendarSheet.getLastColumn());
  const eventMatrix = dataRange.getValues();

  const eventList = eventMatrix.map(function(row) {
    return {
      Date: row[dateIndex],
      Event: row[eventNameIndex],
      Dept: row[departmentIndex]
    };
  });
  return eventList;
}

// THIS HAS HARD CODING.  Perhaps change the pink data to reference config values? TODO
function matchEventData(eventData, sheetData) {
  for (const entry of sheetData) {
    if (eventData.Department === entry.Dept && eventData.Event === entry.Event) {
      return true; // Match found
    }
  }
  return false; // No match found
}

// Sorts dates in the proper order & ensures groupings are retained correctly.
function sortSheet(){
  var lastColumn = CalendarSheet.getLastColumn();
  const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
  range.sort({column: lastColumn, ascending: true});
};

