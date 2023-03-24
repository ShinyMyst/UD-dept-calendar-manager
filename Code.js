// ###################
// Configuration Values
// ###################
const spreadsheetId = 'ID';
const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
const entrySheet = spreadsheet.getSheetByName("Enter_Date");
const entryHeadingsRange = "A1:M1";
const entryRange = "A2:M25";


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

// Main
function main() {
  processNewEntries();
  sortExcel()
};


// Pulls all entries from entry page and checks the checkbox.
// Clears entry after added.
function processNewEntries(){
  const headings = entrySheet.getRange(entryHeadingsRange).getValues()[0];
  var entries = entrySheet.getRange(entryRange).getValues();

  for (const row of entries) {
    var eventData = row

    if (eventData[0] == true) {
      var dataDict = Object.fromEntries(headings.map((key, i) => [key, eventData[i]]));
      updateExcel(dataDict)
      updateGcal(dataDict)
    }
  }
};


// Creates an entry on Excel with given data.
// Does not check for duplicate entries.
function updateExcel(dataDict){

};

// Creates an entry on Excel with given data.
// Does not check for duplicate entries.
function updateGcal(dataDict){

};

// Deletes entry on specified row.
function deleteEntry(line){

};

// Sorts dates in the proper order & ensures groupings are retained correctly.
// Assumes date values have been properly updated.
function sortExcel(){
  
};