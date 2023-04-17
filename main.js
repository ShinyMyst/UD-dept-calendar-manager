// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function processNewEntries(){
  var [entries, rowNumber] = getEnteredData()

  for (const row of entries) {
    var entryDict = Object.fromEntries(InputPage['headingRange'].map((key, i) => [key, row[i]]));  // Pair headings with values in current row
    if (entryDict[InputPage['checkboxName']]){
      updateSheets(entryDict, rowNumber)
      updateGcal(entryDict)
    }
    rowNumber ++
  }
  sortSheet()
};

// ###################
// Helper Functions
// ###################

// Returns a list of all entries on entry page and the row they start on.
function getEnteredData() {
  const range = InputSheet.getRange(InputPage['inputRange'])
  var entries = range.getValues()
  var rowNumber = range.getRow()
  return [entries, rowNumber]
};

// Sorts dates in the proper order & ensures groupings are retained correctly.
function sortSheet(){
  var lastColumn = CalendarSheet.getLastColumn();
  const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
  range.sort({column: lastColumn, ascending: true});
};
