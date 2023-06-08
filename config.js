// ###################
// Manual Entry
// ###################
const spreadsheetId = '1'
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
const inputPageName = getCell('E33')
const InputSheet = spreadsheet.getSheetByName(inputPageName)
const INPUT_HEADINGS = getHeadingRange(InputSheet)

// ========================================
// ===== Information about Calendar Page ==
// ========================================
const calendarPageName = getCell('E32')
const CalendarSheet = spreadsheet.getSheetByName(calendarPageName)
const CALENDAR_RANGE = getHeadingRange(CalendarSheet)

// ==========================================
// ===== Information about Google Calendars ==
// ==========================================
const CALENDAR_NAME = {
  'General': getCell('D42'),
  'Operations': getCell('D43'),
  'Reslife': getCell('D44'),
  'Conferences': getCell('D45'),
  'Training': getCell('D46'),
  'AVIATE': getCell('D47'),
  'Employment': getCell('D48')
}

const CALENDAR_LINK = {
  'General': CalendarApp.getCalendarById(getCell('E42')),
  'Operations': CalendarApp.getCalendarById(getCell('E43')),
  'ResLife': CalendarApp.getCalendarById(getCell('E44')),
  'Conferences': CalendarApp.getCalendarById(getCell('E45')),
  'Training': CalendarApp.getCalendarById(getCell('E46')),
  'AVIATE': CalendarApp.getCalendarById(getCell('E47')),
  'Employment': CalendarApp.getCalendarById(getCell('E48'))
}

// ========================================
// ===== Translate Heading Name into Dict ==
// ========================================
// Some headings must be referenced by name in code.  
// This dict ensures the headings have a static reference name.
// {'Name in Code': Name in Spreadsheet}
const HEADING = {
  'CheckBox': getCell('A32'),
  'StartDate': getCell('A33'),
  'EndDate': getCell('A34'),
  'StartTime': getCell('A35'),
  'EndTime': getCell('A36'),
  'Event': getCell('A37'),
  'Dept': getCell('A38'),
  'Category': getCell('A39'),
  'Calendar': getCell('A40'),
  'Staff': getCell('A41'),
  'Privacy': getCell('A42'),
  'Details': getCell('A43'),
  'Sorting': getCell('A44'),
  'EventID': getCell('A45'),
  'DateRange': getCell('A46')
};
