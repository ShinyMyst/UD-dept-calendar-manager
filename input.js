// ###################
// Input Class
// ###################
class InputEntry {  
  constructor() {
    this.GSHEET_ENTRY = new SheetEntry()
    this.GCAL_ENTRY =  new GcalEntry()
    this.rowIndex = 2
    this._processInput()
  };

  _processInput(){
    const entries = getEnteredData()
    for (const row of entries) {
      // Pair heading name with corresponding row value
      var curEventData = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));

      validateInputData(curEventData)

      if (curEventData[HEADING['CheckBox']]){ 
        this._processEvent(curEventData)
      }
      if (Object.values(curEventData).every(value => !value)){
        InputSheet.deleteRow(this.rowIndex)
      }
      else {
        this.rowIndex ++
      };
    };
    sortSheet()
  };

  _processEvent(eventData){
    // Checked Row
    if (eventData[HEADING['CheckBox']]){
      this.GSHEET_ENTRY.updateGsheet(eventData)
      this.GCAL_ENTRY.updateGcal(eventData)
      };
      // Delete row if both of these succeed.  
      // Log a confirmation for added to sheet, added to cal, and deleted
      // Log and highlight red if duplicate entry
      // Make a validate function.  Highlights and logs errors.
      // Log successes in the processEvents
      // Delete row at the very end
      // Validate months/date.  Currently if it's just a month with no date
      // a gcal entry is NOT created.
    };
  
};




// ###################
// Helper Functions
// ###################
// Returns an array consiting of lists.  Each list contains data for a particular row.
function getEnteredData() {
  const range = InputSheet.getDataRange()
  var entries = range.getValues()
  return entries.slice(1)
};

// Sorts dates in the proper order & ensures groupings are retained correctly.
function sortSheet(){
  var lastColumn = CalendarSheet.getLastColumn();
  const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
  range.sort({column: lastColumn, ascending: true});
};

function validateInputData(curEventData){
  console.log('START TIME HEADING')
  console.log(curEventData[HEADING['StartTime']])
  console.log('START TIME DATE OBJ')
  console.log(Date(curEventData["StartTime"]));
  // check if valid date objects and highlight red if now
};
