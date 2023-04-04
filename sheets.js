// Required imports
// from calendar sheet
calendarSheet = null //
eventNameRange = "B:B" // Column range for the event names
eventNameHeading = "Topic or Contents"
calendarHeadingsRange = "" // Use the getHeadingsRange function to generate this instead
MONTHS = null // include the list of months here
eventIdHeading = 'Event ID'
sortingHeading = 'Sorting'
dateHeading = "Tentative Dates"

//from entry sheet
startDateHeading = 'Start Date'
endDateHeading = 'End Date'
entry_eventNameHeading = "Topic or Contents"




// Updates the calendar sheet.  Returns false if duplicate entry.
function updateSheets(entryDict, rowNumber){
  if (duplicateEntry){
    return false
  };
  SheetEntry(entryDict, rowNumber)
};

// ###################
// Entry Class
// ###################
class SheetEntry {
  constructor(entryDict, rowNumber) {
    this.entryDict = entryDict;
    this.calendarDict = createCalendarDict(entryDict)
    this._processInput()
    this._deleteRow(rowNumber)
  };

  _processInput(){
    this.calendarDict[eventIdHeading] = ''
    const START = this.entryDict[startDateHeading]
    const END = this.entryDict[endDateHeading]

    // Singular Month
    if (MONTHS.includes(START)) {
      this._writeSingularMonth(START)
    }
    // Singular Date
    else if (START.getTime() == END.getTime()) {
      this._writeSingularDate(START)
    } 
    // Date Range
    else {
      this._writeDateRange(START, END)
    }
  };

  // ========================================
  // ===== Writing and Deleting Entries =====
  // ========================================

  // Writes to the next blank row on to the sheet.
  _writeRow() {
    var lastRow = this.calendarSheet.getLastRow();
    var newRow = [];

    for (var heading in this.calendarDict){
      newRow.push(this.calendarDict[heading])
    }

    columnStart = 1
    columnEnd = newRow.length
    amountRows = 1
    this.calendarSheet.getRange(lastRow+1, columnStart, amountRows, columnEnd).setValues([newRow])
  };

  _deleteRow(rowNumber) {
    null
  };

  // ========================================
  // ===== Types of Dates to Process =====
  // ========================================
  _writeSingularMonth(START){
  const date = new Date(`${START} 1, ${new Date().getFullYear()}`);   // Create Date object.
  this.calendarDict[dateHeading] = START
  this.calendarDict[sortingHeading] = date.getTime() - 1
  this._writeRow()
  }

  _writeSingularDate(START){
    this.calendarDict[dateHeading] = START
    this.calendarDict[sortingHeading] = START.getTime()
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
      this.calendarDict[eventIdHeading] = entryDict[entry_eventNameHeading]
      this.calendarDict[dateHeading] = date
      this.calendarDict[sortingHeading] = date.getTime()
      this._writeRow()
      }
    // Singular entry for date range
    const dateString = createDateString(START, END)
    this.calendarDict[eventIdHeading] = ''
    this.calendarDict[dateHeading] = dateString
    this.calendarDict[sortingHeading] = START.getTime() - 1
    this._writeRow()
  };
};

// ###################
// Helper Functions
// ###################

// Returns True if duplicate entry exists; False otherwise.
function duplicateEntry(){
  function getEventList(){
    var eventMatrix = calendarSheet.getRange(eventNameRange).getValues() 
    var eventList = eventMatrix.map(function(row) {
      return row[0];
        });
    return eventList
    // Ideally, this should use eventNameHeading to get the range instead.
  }

  eventName = entryDict[eventNameHeading]
  eventList = getEventList()
  if (eventList.includes(eventName)){
    return true
  } else {
    return false
  }
};

// Creates and returns a dictionary with all calendar headings as keys.
function createCalendarDict(entryDict){
  var calendarDict = {}
  const calendarHeadings = calendarSheet.getRange(calendarHeadingsRange).getValues()[0]; // get values returns a list of rows
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
