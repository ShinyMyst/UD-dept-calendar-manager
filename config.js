// ###################
// Manual Entry
// ###################
const spreadsheetId = 'i'
const configPageName = "config"

const MONTHS = [
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
// Automated 
// ###################
// Utilizes config page of the Google Sheet to pull info

// ========================================
// ===== Set-Up =====
// ========================================
const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
const configSheet = spreadsheet.getSheetByName(configPageName)

// ========================================
// ===== Helper Functions =====
// ========================================
// Get the value of target cell
function getCell(targetCell){
  const value = configSheet.getRange(targetCell).getValue()
  return value
};

// Get all headings for a sepcified sheet
function getHeadingRange(sheet) {
  const startRow = 1
  const startColumn = 1
  const numRows = 1
  const numColumns = sheet.getLastColumn()

  const headingRange = sheet.getRange(startRow, startColumn, numRows, numColumns)
  const headings = headingRange.getValues()[0]
  return headings
};

// ========================================
// ===== Information about Input Page =====
// ========================================
const inputPageName = getCell('B3')
const InputSheet = spreadsheet.getSheetByName(inputPageName)
const INPUT_HEADINGS = getHeadingRange(InputSheet)

// ========================================
// ===== Information about Calendar Page ==
// ========================================
const calendarPageName = getCell('B2')
const CalendarSheet = spreadsheet.getSheetByName(calendarPageName)
const SHEET_HEADINGS = getHeadingRange(CalendarSheet)

// ==========================================
// ===== Information about Google Calendars ==
// ==========================================
const CALENDAR_NAME = {
  'General': getCell('A6'),
  'Operations': getCell('A7'),
  'ResLife': getCell('A8'),
  'Conferences': getCell('A9'),
  'Training': getCell('A10'),
  'AVIATE': getCell('A11'),
  'Employment': getCell('A12')
}

const CALENDAR_LINK = {
  'General': CalendarApp.getCalendarById(getCell('B6')),
  'Operations': CalendarApp.getCalendarById(getCell('B7')),
  'ResLife': CalendarApp.getCalendarById(getCell('B8')),
  'Conferences': CalendarApp.getCalendarById(getCell('B9')),
  'Training': CalendarApp.getCalendarById(getCell('B10')),
  'AVIATE': CalendarApp.getCalendarById(getCell('B11')),
  'Employment': CalendarApp.getCalendarById(getCell('B12'))
}

// ========================================
// ===== Translate Heading Name into Dict ==
// ========================================
// Some headings must be referenced by name in code.  
// This dict ensures the headings have a static reference name.
// {'Name in Code': Name in Spreadsheet}
const HEADING = {
  'CheckBox': getCell('D2'),
  'StartDate': getCell('D3'),
  'EndDate': getCell('D4'),
  'StartTime': getCell('D5'),
  'EndTime': getCell('D6'),
  'Event': getCell('D7'),
  'Dept': getCell('D8'),
  'Category': getCell('D9'),
  'Calendar': getCell('D10'),
  'Staff': getCell('D11'),
  'Privacy': getCell('D12'),
  'Details': getCell('D14'),
  'Sorting': getCell('D15'),
  'EventID': getCell('D16'),
  'DateRange': getCell('D17')
};
