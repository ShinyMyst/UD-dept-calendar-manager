// ###################
// Configuration Values
// ###################
const spreadsheetId = 'ID';
const spreadsheet = SpreadsheetApp.openById('ID');
const entrySheet = spreadsheet.getSheetByName("Enter_Date");
const calendarSheet = spreadsheet.getSheetByName("Calendar")
const entryHeadingsRange = "A1:M1";
const calendarHeadingsRange = 'A1:K1'
const entryRange = "A2:M25";
const months = [
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June", 
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];



// Every n hours
// Pull Data from Entry Page
// Execute commands if box checked.
// (Data verification on Excel for keys)
// If date is span, add multiple entries (account for keys)
// If date is single, add single entry (no keys given)
// Add Entries to Excel
// Add Entries to Gcal (always span)

// Verify Groupings are retained
// Determine how to run function at set intervals
// Determine how to run functions on edit for Gcal and Spreadsheet
// Highlight entries that are duplicates in name and date

// Excel, change heading formatting based on if it matches entry page.
// Return a log of headings that don't match when script is run
// Excel should not allow event id to be entere unless it's a date span
// Excel should validate data.
// Headings should be made by cell reference.

// Main
function main() {
  processNewEntries();
  sortSheet()
};


// Pulls all entries from entry page that are checked.
// Goes row by row adding them to an entry dict.
// Clears row and dict after each row added.
function processNewEntries(){
  const entryHeadings = entrySheet.getRange(entryHeadingsRange).getValues()[0]; // get values returns a list of rows
  var entries = entrySheet.getRange(entryRange).getValues();

  for (const row of entries) {
    var eventData = row

    if (eventData[0] == true) {
      var entryDict = Object.fromEntries(entryHeadings.map((key, i) => [key, eventData[i]]));
      updateExcel(entryDict)
      updateGcal(entryDict)
      // Delete row after it's added
    }
  }
};



// Creates an entry on Excel with given data.
// Does not check for duplicate entries.
// Assumes dates and values have been data validated by Excel
function updateExcel(entryDict){
  var calendarDict = createCalendarDict(entryDict)

  // Singular Month
  if (months.includes(entryDict['Start Date'])) {
    var monthName = entryDict['Start Date']
    var date = new Date(`${monthName} 1, ${new Date().getFullYear()}`);
    calendarDict['Tentative Dates'] = entryDict['Start Date']
    calendarDict['Sorting'] = date.getTime() - 1
  }
  // Singular Date
  else if (entryDict['Start Date'].getTime() == entryDict['End Date'].getTime()) {
    calendarDict['Tentative Dates'] = entryDict['Start Date']
    calendarDict['Sorting'] = entryDict['Start Date'].getTime()
  } 
  // Date Range
  else {
    for (let date = new Date(entryDict['Start Date']); date <= entryDict['End Date']; date.setDate(date.getDate() + 1)) {
      calendarDict['Tentative Dates'] = date
      calendarDict['Sorting'] = date.getTime()
      addRow(calendarDict)
    }

    var startDate = entryDict['Start Date'];
    var endDate = entryDict['End Date'];

    var startMonth = startDate.toLocaleString('default', { month: 'long' });
    var endMonth = endDate.toLocaleString('default', { month: 'long' });
    var startDay = startDate.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });
    var endDay = endDate.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });

    const dateString = startMonth + ' ' + startDay + ' - ' + endMonth + ' ' + endDay;

    calendarDict['Event ID'] = ''
    calendarDict['Tentative Dates'] = dateString
    calendarDict['Sorting'] = entryDict['Start Date'].getTime() - 1

  }




  addRow(calendarDict)



};

// Delete entry row when done with everything.


// Fills in next blank row based on provided dictionary.
function addRow(calendarDict) {
  var lastRow = calendarSheet.getLastRow();
  var newRow = [];

  for (var heading in calendarDict){
    newRow.push(calendarDict[heading])
  }

  columnStart = 1
  columnEnd = newRow.length
  amountRows = 1
  calendarSheet.getRange(lastRow+1, columnStart, amountRows, columnEnd).setValues([newRow])
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


// Creates an entry on Excel with given data.
// Does not check for duplicate entries.
function updateGcal(dataDict){
  // Add based on ???

};

// Deletes entry on specified row.
function deleteEntry(line){

};

// Sorts dates in the proper order & ensures groupings are retained correctly.
// Assumes date values have been properly updated in last column.
function sortSheet(){
  var lastColumn = calendarSheet.getLastColumn();
  const range = calendarSheet.getRange(2, 1, calendarSheet.getLastRow() - 1, lastColumn);
  range.sort({column: lastColumn, ascending: true});
  // Refactor this function a bit.
  // WORK ON GROUPING COMMANDS HERE <--------------------------------- 
};