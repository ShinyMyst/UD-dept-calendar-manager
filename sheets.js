// ###################
// Entry Class
// ###################
class SheetEntry {
  constructor() {
    this.entryDict = null;
    this.calendarDict = null;
    this.sheetData = getEventList()
  };

  updateGsheet(eventData){
    this.entryDict = eventData
    this.calendarDict = createCalendarDict(eventData)

    if (!matchEventData(eventData, this.sheetData)){
      console.log("DUPLICATE NOT FOUND")
      this._processInput()
    }
    else {
      console.log("DUPLICATE FOUND")
    }
  }

  _processInput(){
    this.calendarDict[HEADING['EventID']] = ''
    const START = this.entryDict[HEADING['StartDate']]
    const END = this.entryDict[HEADING['EndDate']]

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
  _writeRow() {
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
  // ===== Types of Dates to Process =====
  // ========================================
  _writeSingularMonth(START){
  const date = new Date(`${START} 1, ${new Date().getFullYear()}`);   // Create Date object.
  this.calendarDict[HEADING['DateRange']] = START
  this.calendarDict[HEADING['Sorting']] = date.getTime() - 1
  this._writeRow()
  }

  _writeSingularDate(START){
    this.calendarDict[HEADING['DateRange']] = START
    this.calendarDict[HEADING['Sorting']] = START.getTime()
    this._writeRow()
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
      this._writeRow()
      }
    // Singular entry for date range
    const dateString = createDateString(START, END)
    this.calendarDict[HEADING['EventID']] = ''
    this.calendarDict[HEADING['DateRange']] = dateString
    this.calendarDict[HEADING['Sorting']] = START.getTime() - 1
    this._writeRow()
  };
};

// ###################
// Helper Functions
// ###################
// Creates and returns a dictionary with all calendar headings as keys.
function createCalendarDict(entryDict){
  var calendarDict = {}
  //CalendarSheet.getRange(CalendarPage['headingRange']).getValues()[0]; // get values returns a list of rows
  const calendarHeadings = CALENDAR_PAGE_RANGE
  // Fill calendarDict with matching values
  for (var index in calendarHeadings) {
    var heading = calendarHeadings[index]
    // Add matching data from entry page to calendarDict.
    if (entryDict.hasOwnProperty(heading)) {
      calendarDict[heading] = entryDict[heading];
    } else {
      calendarDict[heading] = ''
    }
  }
  return calendarDict
};

// REFACTOR REFERENCES TO BE FLUID INSTEAD OF HARDCODED
// Get all existing entries
// Make sure data matches the ones called in event data
function getEventList() {
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

// THIS HAS HARD CODING.  Perhaps change the pink data to reference config values?
function matchEventData(eventData, sheetData) {
  for (const entry of sheetData) {
    if (eventData.Department === entry.Dept && eventData.Event === entry.Event) {
      return true; // Match found
    }
  }
  return false; // No match found
}

