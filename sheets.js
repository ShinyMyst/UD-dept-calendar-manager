// ###################
// Entry Class
// ###################

//TODO - Try adding a create Sorting ID function.
// This could simplify later function and allow date checking for duplicates

class SheetEntry {
  constructor() {
    this.sheetData = getSheetData()  
  };

  // Returns true if sheet data is valid
  validEvent(eventData){
    console.log("SHEETDATA", this.sheetData)
    console.log("EVENTDATA", eventData)


    switch (true) {
      // Duplicate Entry
      /*
      case (matchEventData(eventData, this.sheetData)):
        console.log("DUPLICATE FOUND")
        return false
      */

      // Add other validation here

      default:
        return true
    }
  };

  // Add event data to last row of sheet and to sheetData
  addEvent(eventData){
    // Variables for readability
    const startDate = eventData[HEADING['StartDate']]
    const endDate = eventData[HEADING['EndDate']]

    // Write Entry
    switch (true) {
      // Singular Month
      case MONTHS.includes(startDate):
        this._writeSingularMonth(startDate);
        break;   
      // Singular Date
      case endDate === '':
        this._writeSingularDate(startDate);
        break;
      case startDate.getTime() == endDate:
        this._writeSingularDate(startDate);
        break;
      // Date Range
      default:
        this._writeDateRange(startDate, endDate);
        break;
    }  
    // Add the new entry to the list of events
    var newSheetData = {
      [HEADING['Event']]: eventData[HEADING['Event']],
      [HEADING['Dept']]: eventData[HEADING['Dept']]
    };
    this.sheetData.push(newSheetData)
  };

  // Sorts dates in the proper order & ensures groupings are retained correctly.
  sortSheet(){
    var lastColumn = CalendarSheet.getLastColumn();
    const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
    range.sort({column: lastColumn, ascending: true});
  };

// TODO - Try to reorganize this section
  // ========================================
  // ===== Writing and Deleting Entries =====
  // ========================================

  // WRITES the data onto the sheet
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
  };

// TODO - Try to reorganize this section
  // ========================================
  // ===== Types of Dates to Write =====
  // ========================================
  _writeSingularMonth(START){
  const date = new Date(`${START} 1, ${new Date().getFullYear()}`);   // Create Date object.
  this.calendarDict[HEADING['DateRange']] = START
  this.calendarDict[HEADING['Sorting']] = date.getTime() - 1
  this._writeRow()
  };

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
// Get list of all existing entries
// [{ Event: 'Event', Department: 'Department' }]
function getSheetData() {
  const headerRow = 1; // Assuming the header row is the first row
  const headers = CalendarSheet.getRange(headerRow, 1, 1, CalendarSheet.getLastColumn()).getValues()[0];

  const dataRange = CalendarSheet.getRange(headerRow + 1, 1, CalendarSheet.getLastRow() - headerRow, CalendarSheet.getLastColumn());
  const eventMatrix = dataRange.getValues();

  const eventList = eventMatrix.map(function(row) {
    return {
      [HEADING['Event']]: row[headers.indexOf(HEADING['Event'])],
      [HEADING['Dept']]: row[headers.indexOf(HEADING['Dept'])]
    };
  });

  return eventList;
};

/*
// Checks for matching Event Name and Department
function matchEventData(eventData, sheetData) {
  for (const entry of sheetData) {
    if (eventData.HEADING['Dept'] === entry.HEADING['Dept'] && eventData.HEADING['Event'] === entry.HEADING['Event']) {
      return true; // Match found
    }
  }
  return false; // No match found
};
*/

// Documentation Notes for Page
// Duplicates only checks for Event Name & Department.
