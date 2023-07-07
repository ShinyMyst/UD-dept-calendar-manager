// ###################
// Sheet
// ###################

class SheetEntry {
  constructor() {
    this.sheetData = getSheetData()
    this.rowData = null
    this.eventData = null
  };

  // ========================================
  // ===== Public Functions =====
  // ========================================

  // Update class parameters; return false if invalid
  updateData(eventData){
    this.eventData = eventData
    return this._validEvent()
  };

  // Check if this.eventData is valid
  _validEvent(){
    switch (true) {
      // Duplicate Entry
      case (this.checkDuplicates()):
        Logger.log("Duplicate Event")
        return false
     default:
        return true
    }
  };

  // Add event data to last row of sheet and to sheetData
  addEvent(){
    this.rowData = this._fillRowData(this.eventData)
    this._fillRowDates()
    this._writeRow() 

    // Add the new entry to the list of events
    var newSheetData = {
      [HEADING['Event']]: this.eventData[HEADING['Event']],
      [HEADING['Dept']]: this.eventData[HEADING['Dept']],
      [HEADING['Sorting']]: this.eventData[HEADING['Sorting']]
    };
    this.sheetData.push(newSheetData)
  };

  // Sorts dates in the proper order & ensures groupings are retained correctly.
  sortSheet(){
    var lastColumn = CalendarSheet.getLastColumn();
    const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
    range.sort({column: lastColumn, ascending: true});
  };

  // ========================================
  // ===== Writing and Deleting Entries =====
  // ========================================

  // WRITES the data onto the sheet
  _writeRow() {
    var lastRow = CalendarSheet.getLastRow();
    var newRow = [];

    for (var heading in this.rowData){
      newRow.push(this.rowData[heading])
    }

    const columnStart = 1
    const columnEnd = newRow.length
    const amountRows = 1
    CalendarSheet.getRange(lastRow+1, columnStart, amountRows, columnEnd).setValues([newRow])
  };


  // Creates and returns a dictionary with all calendar headings as keys.
  _fillRowData(){
    var rowData = {}
    // Fill rowData with matching values
    for (var index in SHEET_HEADINGS) {
      var heading = SHEET_HEADINGS[index]
      // Add matching data from entry page to calendarDict.
      if (this.eventData.hasOwnProperty(heading)) {
        rowData[heading] = this.eventData[heading];
      } else {
        rowData[heading] = ''
      }
    }
    return rowData
  };

  // Adds information about dates to the row to be wr
  _fillRowDates(){
    var startDate = this.eventData[HEADING['StartDate']]
    var endDate = this.eventData[HEADING['EndDate']]
    this.rowData[HEADING['EndDate']] = ''

    switch (true) {
      // Month Only
      case MONTHS.includes(startDate):
        const date = new Date(`${startDate} 1, ${new Date().getFullYear()}`);   // Create Date object for sorting
        this.rowData[HEADING['Sorting']] = date.getTime() - 2       
        break;
      
      // Spanning Dates
      case startDate.getTime() != endDate.getTime():
        this.rowData[HEADING['EndDate']] = endDate
        this.rowData[HEADING['Sorting']] = startDate.getTime() - 1       

      // Default 
      default:
        this.rowData[HEADING['Sorting']] = startDate.getTime()    
    }
  };

  // Checks for matching Event Name, Department, and Sorting Number
  checkDuplicates() {
    // TODO account for months in a better fashion
    if (MONTHS.includes(this.eventData[HEADING['StartDate']])){
      return false
    }
    for (const entry of this.sheetData) {
      if (this.eventData[HEADING['Dept']] === entry[HEADING['Dept']] && this.eventData[HEADING['Event']] === entry[HEADING['Event']] && this.eventData[HEADING['StartDate']].getTime() === entry[HEADING['Sorting']]) {
        return true; // Match found
      }
    }
    return false; // No match found
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

  const numRows = CalendarSheet.getLastRow() - headerRow;
  const numColumns = CalendarSheet.getLastColumn();

  if (numRows < 1) {
    // Return blank or an empty array, depending on your preference
    return []; // or return '';
  }

  const dataRange = CalendarSheet.getRange(headerRow + 1, 1, numRows, numColumns);
  const eventMatrix = dataRange.getValues();

  const eventList = eventMatrix.map(function(row) {
    return {
      [HEADING['Event']]: row[headers.indexOf(HEADING['Event'])],
      [HEADING['Dept']]: row[headers.indexOf(HEADING['Dept'])],
      [HEADING['Sorting']]: row[headers.indexOf(HEADING['Sorting'])]
    };
  });

  return eventList;
};

// Documentation Notes for Page
// Duplicates only checks for Event Name & Department & Sorting Number