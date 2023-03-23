const spreadsheetId = 'ID';
const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
const entrySheet = spreadsheet.getSheetByName("Enter_Date");

function printIf() {
  var entries = entrySheet.getRange("A2:M25").getValues();
  for (const row of entries) {
    var eventData = row
    if (eventData[0] == true) {
      console.log(eventData)}
    }

};

// Adds a new to sheets and Gcal

// Adding event is the same for both calendars 
// EXCEPT, the non expanded one does a range and makes multiple entries.
// So call this once for regular calendar and a for loop for other calendar
//function addEvent(sheet, date, event_info) {

//};

// Add to Gcal


function myFunction(targetRange) {
  const values = Sheets.Spreadsheets.Values.get(spreadsheetId, targetRange).values;
  return values
};


function checkRange() {
  console.log(entrySheet.getLastRow());

};

function test() {
  targetRange = 'Enter_Date!A2:N2';
  console.log(myFunction(targetRange))
};
