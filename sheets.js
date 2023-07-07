// ###################
// Sheet
// ###################
class SheetEntry {
  constructor() {
    this.sheetData = getSheetData()
    this.eventData = null
    this.rowData = null
  };

  // ========================================
  // ===== Public Functions =====
  // ========================================

  // Update class parameters; return false if invalid
  updateData(eventData){
    this.eventData = eventData
    return this._validEvent()
  };

  // Add event data to last row of sheet and to sheetData
  addEvent(){
    this.rowData = this._fillRowData(this.eventData)
    this._fillRowDates()
    this._writeRow() 
    this._updateSheetData()
  };

  // Sorts dates in the proper order & ensures groupings are retained correctly.
  sortSheet(){
    var lastColumn = CalendarSheet.getLastColumn();
    const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
    range.sort({column: lastColumn, ascending: true});
  };

  _updateSheetData() {
    var newSheetData = {
      [HEADING['Event']]: this.eventData[HEADING['Event']],
      [HEADING['Dept']]: this.eventData[HEADING['Dept']],
      [HEADING['Sorting']]: this.eventData[HEADING['Sorting']]
    };
    this.sheetData.push(newSheetData)
  }

  // ========================================
  // ===== Event Validation             =====
  // ========================================
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

  // Checks for matching Event Name, Department, and Sorting Number
  checkDuplicates() {
    // TODO - we don't actually check for duplicates if date is a singular month...
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

  // ========================================
  // ===== Writing data to the sheet    =====
  // ========================================
  // Write the data onto the sheet
  _writeRow() {
    var lastRow = CalendarSheet.getLastRow();
    var newRow = [];

    // Saves row data
    for (var heading in this.rowData){
      newRow.push(this.rowData[heading])
    }

    // Write saved row data to sheet
    const columnStart = 1
    const columnEnd = newRow.length
    const amountRows = 1
    CalendarSheet.getRange(lastRow+1, columnStart, amountRows, columnEnd).setValues([newRow])
  };

  // Creates dict of all the data that needs added to the row.
  // Uses all calendar headings from the eventData as keys.
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

  // Adds information about dates 
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