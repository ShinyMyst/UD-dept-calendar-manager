// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function processNewEntries(){
  var entries = getEnteredData()
  entries.shift() // Remove heading line
  rowNumber = 2 // Start on the row after the headings


  for (const row of entries) {
    var entryDict = Object.fromEntries(InputPage['headingRange'].map((key, i) => [key, row[i]]));  // Pair headings with values in current row

    // Try updating calendar with new entry data
    // Delete row if successful otherwise move to next row
    if (entryDict[InputPage['checkboxName']]){
      if (updateSheets(entryDict, rowNumber)){
        InputSheet.deleteRow(rowNumber)
        Logger.log("Input Page.  Deleted " + eventName)
      }
      else {
        rowNumber ++
      }
      updateGcal(entryDict)
    }
  
    // Delete empty rows OR move to the next row.
    else if (Object.values(entryDict).every(value => !value)){
      InputSheet.deleteRow(rowNumber)
    }
    else {
      rowNumber ++
    }
  }
  sortSheet()
};

// ###################
// Helper Functions
// ###################

// Attempt to data on current row to Google Sheets or GCal
// Sheet and Gcal functions perform validation checks.
function updateEvents(entryDict, rowNumber){
  if (entryDict[InputPage['checkboxName']]){
    if (updateSheets(entryDict, rowNumber)){
      InputSheet.deleteRow(rowNumber)
    }
    updateGcal(entryDict)
  }
};

// Returns a list of all entries on entry page and the row they start on.
function getEnteredData() {
  const range = InputSheet.getDataRange()
  var entries = range.getValues()
  return entries
};

// Sorts dates in the proper order & ensures groupings are retained correctly.
function sortSheet(){
  var lastColumn = CalendarSheet.getLastColumn();
  const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
  range.sort({column: lastColumn, ascending: true});
};
