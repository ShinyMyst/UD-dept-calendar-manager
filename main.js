// NEEDED IMPORTS

// Entry Page Data
entrySheet = null
entryInputRange = null // Where to check for entry data.  Dynamically generate in config
checkBoxCol = null // String representing the name of the column with the check boxes



// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function processNewEntries(){
  const headings = getHeadingRange(entrySheet)
  var [entries, rowNumber] = getEntryData(entrySheet)

  for (const row of entries) {
    var entryDict = Object.fromEntries(headaings.map((key, i) => [key, row[i]]));  // Pair headings with values in current row
    if (entryDict[checkBoxCol]){
      updateSheets(entryDict, rowNumber)
      updateGcal(entryDict)
      sortSheet()
    rowNumber ++
    }
  }
};


// ###################
// Helper Functions
// ###################

// Get all headings for a sepcified sheet
function getHeadingRange(sheet) {
  const startRow = 1
  const startColumn = sheet.getFirstColumn()
  const numRows = 1
  const numColumns = sheet.getLastColumn()

  const headingRange = sheet.getRange(startRow, startColumn, numRows, numColumns)
  const headings = sheet.getRange(headingRange).getValues()[0]
  return headings
};

// Returns a list of all entries on entry page and the row they start on.
function getEntryData() {
  const range = entrySheet.getRange(entryDataRange)
  var entries = range.getValues()
  var rowNumber = range.getRow()
  return entries, rowNumber
};
