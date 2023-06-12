// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function main(){
  var entries = getEnteredData()
  const GSHEET_ENTRY = initGsheetClass()
  const GCAL_ENTRY =  initGcalClass()

  for (const [rowIndex, row] of entries) {
    // Pair heading name with corresponding row value
    var curEvent = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));

    if (entryDict[HEADING['CheckBox']]){ 
      processEvent(curEvent)
    }
    else if (Object.values(curEvent).every(value => !value)){
      InputSheet.deleteRow(rowIndex+2) // +1 to match sheets.  +1 to skip heading row
    };
  };
  sortSheet()
};

function processEvent(event){
  // Checked Row
  if (event[HEADING['CheckBox']]){
    updateGsheet(event)
    updateGcal(event)
    // Delete row if both of these succeed.  
    // Log a confirmation for added to sheet, added to cal, and deleted
  };
}

// ###################
// Helper Functions
// ###################

// Returns an array consiting of lists.  Each list contains data for a particular row.
function getEnteredData() {
  const range = InputSheet.getDataRange()
  var entries = range.getValues()
  return entries.slice
};

// Sorts dates in the proper order & ensures groupings are retained correctly.
function sortSheet(){
  var lastColumn = CalendarSheet.getLastColumn();
  const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
  range.sort({column: lastColumn, ascending: true});
};
