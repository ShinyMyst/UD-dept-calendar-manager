// This doc is in DIRE need of a major refactor.
// Use class to help refactor

// ###################
// Configuration Values
// ###################

// SpreadSheet Data
const spreadsheetId = 'ID';
const spreadsheet = SpreadsheetApp.openById('');

// Calendar Page Info
const calendarSheet = spreadsheet.getSheetByName("Calendar")
const calendarHeadingsRange = 'A1:K1'

// Entry Page Info
const entrySheet = spreadsheet.getSheetByName("Enter_Date");
const entryHeadingsRange = "A1:M1";
const entryDataRange = "A2:M25";

// Other Info
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
  "December"];




// Verify Groupings are retained
// Determine how to run function at set intervals
// Determine how to run functions on edit for Gcal and Spreadsheet
// Highlight entries that are duplicates in name and date

// Excel, change heading formatting based on if it matches entry page.
// Return a log of headings that don't match when script is run
// Excel should not allow event id to be entere unless it's a date span
// Excel should validate data.
// Headings should be made by cell reference.

// ###################
// Main Functions 
// ###################
// Assumes dates and values have been data validated by Excel
function main() {
  processNewEntries();
  sortSheet()
};


// Pulls all checked entries from entry page.  Creates new rows and Gcal entries for these entries then remove them from page.
function processNewEntries(){
  const entryHeadings = entrySheet.getRange(entryHeadingsRange).getValues()[0]; // get values returns a list of rows
  var entries = entrySheet.getRange(entryDataRange).getValues();

  for (const row of entries) {
    var eventData = row

    if (eventData[0] == true) {
      var entryDict = Object.fromEntries(entryHeadings.map((key, i) => [key, eventData[i]]));
      updateSheets(entryDict)
      updateGcal(entryDict)
      // Delete row after it's added
    }
  }
};

// ###################
// Adding Entries to Sheets
// ###################
// Creates a new entry on Sheets.
function updateSheets(entryDict){

  // Events that are already in place.
  var eventMatrix = calendarSheet.getRange("B:B").getValues()
  var eventList = eventMatrix.map(function(row) {
    return row[0];
      });
  console.log(eventList)
  // Generate this at the start of adding entries then append instead of regenerating.

  // Create an if else for whether or not the entry is a duplicate to proceed.
  // Make it a function?
  insertRow(entryDict)

};

// Formats row data based on date style then writes it to sheet
function insertRow(entryDict){
  var calendarDict = createCalendarDict(entryDict)
  const START = entryDict['Start Date']
  const END = entryDict['End Date']

  // Singular Month
  if (months.includes(START)) {
    var date = new Date(`${START} 1, ${new Date().getFullYear()}`);
    calendarDict['Tentative Dates'] = START
    calendarDict['Sorting'] = date.getTime() - 1
  }
  // Singular Date
  else if (START.getTime() == END.getTime()) {
    calendarDict['Tentative Dates'] = START
    calendarDict['Sorting'] = START.getTime()
  } 
  // Date Range
  else {
    // Entries for each date
    for (let date = new Date(START); date <= END; date.setDate(date.getDate() + 1)) {
      calendarDict['Tentative Dates'] = date
      calendarDict['Sorting'] = date.getTime()
      writeRow(calendarDict)
    }
    // Singular entry for the range
    const dateString = createDateString(START, END)
    calendarDict['Event ID'] = ''
    calendarDict['Tentative Dates'] = dateString
    calendarDict['Sorting'] = START.getTime() - 1
  }
  writeRow(calendarDict)
};



// Creates a string indiciating the range of two date objects such as: Jan 1st-Jan 3rd
function createDateString(start, end){
    var startMonth = start.toLocaleString('default', { month: 'long' });
    var endMonth = end.toLocaleString('default', { month: 'long' });
    var startDay = start.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });
    var endDay = end.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });

    const dateString = startMonth + ' ' + startDay + ' - ' + endMonth + ' ' + endDay;
    return dateString;
};

// Writes the next blank row on to the sheet.
function writeRow(calendarDict) {
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