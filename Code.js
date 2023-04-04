// This doc is in DIRE need of a major refactor.
// Use class to help refactor

// ###################
// Configuration Values
// ###################

// SpreadSheet Data
const spreadsheetId = 'ID';
const spreadsheet = SpreadsheetApp.openById(ID);

// Calendar Page Info
const calendarSheet = spreadsheet.getSheetByName("Calendar")
const calendarHeadingsRange = 'A1:K1'

// Entry Page Info
const entrySheet = spreadsheet.getSheetByName("Enter_Date");
const entryHeadingsRange = "A1:M1";
const entryDataRange = "A2:M25";

// Calendars
const generalCalendarId = ID
const operationsCalendarId = ID
const residenceLifeCalendarId = ID
const learningCalendarId = ID

const generalCal = CalendarApp.getCalendarById(generalCalendarId);
const operationsCal = CalendarApp.getCalendarById(operationsCalendarId);
const reslifeCal = CalendarApp.getCalendarById(residenceLifeCalendarId);
const lldCal = CalendarApp.getCalendarById(learningCalendarId);


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

// ###################
// Main Functions 
// ###################
function main() {
  processNewEntries();
  sortSheet()
};

// Pulls all checked entries from entry page.  Creates new rows and Gcal entries for these entries then removes them from page.
function processNewEntries(){
  const entryHeadings = entrySheet.getRange(entryHeadingsRange).getValues()[0]; // get values returns a list of rows
  // Entry Info
  const range = entrySheet.getRange(entryDataRange)
  var rowNumber = range.getRow()
  const entries = range.getValues()

  for (const row of entries) {
    var eventData = row

    if (eventData[0] == true) {
      var entryDict = Object.fromEntries(entryHeadings.map((key, i) => [key, eventData[i]]));
      updateSheets(entryDict)
      createCalendarEvent(entryDict)
      //updateGcal(entryDict)
      // Delete row after it's added
      rowNumber ++
    }
  }
};

// ###################
// Updating Sheets
// ###################
// Creates a new entry on Sheets.
function updateSheets(entryDict){

  // Events that are already in place.
  var eventMatrix = calendarSheet.getRange("B:B").getValues()
  var eventList = eventMatrix.map(function(row) {
    return row[0];
      });
  // Current Event Being Added
  eventName = entryDict['Topic or Contents']

  // Add event if it doesn't already exist.
  if (!eventList.includes(eventName)){
    insertRow(entryDict)
  } else {
    return false
  }
};

// Formats row data based on date style then writes it to sheet
function insertRow(entryDict){
  var calendarDict = createCalendarDict(entryDict)
  calendarDict['Event ID'] = ''
  const START = entryDict['Start Date']
  const END = entryDict['End Date']

  // Singular Month
  if (months.includes(START)) {
    writeSingularMonth(calendarDict, START)
  }
  // Singular Date
  else if (START.getTime() == END.getTime()) {
    writeSingularDate(calendarDict, START)
  } 
  // Date Range
  else {
    writeDateRange(calendarDict, entryDict, START, END)
  }
};

// ###################
// Date Functions
// ###################
function writeSingularMonth(calendarDict, START){
  const date = new Date(`${START} 1, ${new Date().getFullYear()}`);   // Create Date object.
  calendarDict['Tentative Dates'] = START
  calendarDict['Sorting'] = date.getTime() - 1
  writeRow(calendarDict)
}

function writeSingularDate(calendarDict, START){
  calendarDict['Tentative Dates'] = START
  calendarDict['Sorting'] = START.getTime()
  writeRow(calendarDict)
};

function writeDateRange(calendarDict, entryDict, START, END){
  // Entries for each individual date
  for (let date = new Date(START); date <= END; date.setDate(date.getDate() + 1)) {
    calendarDict['Event ID'] = entryDict['Topic or Contents']
    calendarDict['Tentative Dates'] = date
    calendarDict['Sorting'] = date.getTime()
    writeRow(calendarDict)
    }
  // Singular entry for date range
  const dateString = createDateString(START, END)
  calendarDict['Event ID'] = ''
  calendarDict['Tentative Dates'] = dateString
  calendarDict['Sorting'] = START.getTime() - 1
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

// Writes to the next blank row on to the sheet.
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
function updateGcal(targetCalendar, eventDescription, dates){
  if (!calendar.getEventsForDay(date, {search: eventTitle}).length){
    var eventDescription = `
          Category: ${calendarDict['Category']}
          Staff Responsible: ${calendarDict['Staff Responsible']}
          Privacy: ${calendarDict['Privacy']}
          Notes: ${calendarDict['Notes']}
          Link: ${calendarDict['Link']}
        `;
        // Add event to calendar
        var event = targetCalendar.createAllDayEvent(eventTitle, dates[0], dates[dates.length - 1]);//this makes date the same if no endDate
        event.setDescription(eventDescription);
  }

};
// Adjust privacy entry on calendar itself instead of noting it here.
// Create a way to configure event descriptions in config
// Create an excel config page that the config page will read

function getCalendar(entryDict){
  switch(entryDict['Department/Branch']) {
    case 'Housing Operations':
      return operationsCal

    case 'L&L Dev':
      return lldCal

    case 'Residence Life':
      return reslifeCal

    default:
      return generalCal

  }
}

function getDateRange(entryDict){
  START = entryDict['Start Date']
  END = entryDict['End Date']
  if (START.getTime() === END.getTime()) {
    return [entryDict['Start Date']]
  }
  return [entryDict['Start Date'], entryDict['End Date']]
}

function getDescription(entryDict){
  var eventDescription = `
      Category: ${entryDict['Category']}
      Staff Responsible: ${entryDict['Primary Staff Responsible']}
      Privacy: ${entryDict['Privacy']}
      Notes: ${entryDict['Notes']}
      Link: ${entryDict['Link']}
    `;
  return eventDescription
}

function createCalendarEvent(entryDict){
  // If no specific date given, skip calendar creation
  if (months.includes(entryDict['Start Date'])){
    return null
  } 

  var calendar = getCalendar(entryDict)
  var dates = getDateRange(entryDict)
  var description = getDescription(entryDict)
  var title = entryDict['Topic or Contents']

  if (!calendar.getEventsForDay(dates[0], {search: title}).length){
    var event = calendar.createAllDayEvent(title, ...dates);
    event.setDescription(description)    
  }
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