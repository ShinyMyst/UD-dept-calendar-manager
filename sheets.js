// Updates the calendar sheet.  Returns false if duplicate entry.
function updateSheets(entryDict, rowNumber){
  if (duplicateEntry(entryDict)){
    var eventName = entryDict[HEADING['Event']]
    Logger.log("Input Page.  Duplicate Entry " + eventName)
    return false
  };
  entry = new SheetEntry(entryDict, rowNumber)
  return entry.processInput()
};

// ###################
// Entry Class
// ###################
class SheetEntry {
  constructor(entryDict) {
    this.entryDict = entryDict;
    this.calendarDict = createCalendarDict(entryDict)
  };

  processInput(){
    this.calendarDict[HEADING['EventID']] = ''
    const START = this.entryDict[HEADING['StartDate']]
    const END = this.entryDict[HEADING['EndDate']]

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
    return true
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

// Returns True if duplicate entry exists; False otherwise.
function duplicateEntry(entryDict){
  function getEventList(){
    var eventMatrix = CalendarSheet.getRange('A:C').getValues() // This is a list of lists that include event name and dept
    var eventList = eventMatrix.map(function(row) {return row[0]}); // This is a list of event names
    return [eventList, eventMatrix]
  }
  eventName = entryDict[HEADING['Event']]
  eventCategory = entryDict[HEADING['Dept']]
  eventEntry = [eventName, eventCategory]
  const [eventList, eventMatrix] = getEventList()
  if (eventList.includes(eventName)){
    const found = eventMatrix.some(array => {
      return array.join(',') === eventEntry.join(',');
    });
    return found;
  } 
};

// Creates and returns a dictionary with all calendar headings as keys.
function createCalendarDict(entryDict){
  var calendarDict = {}
  //CalendarSheet.getRange(CalendarPage['headingRange']).getValues()[0]; // get values returns a list of rows
  const calendarHeadings = CALENDAR_RANGE
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
