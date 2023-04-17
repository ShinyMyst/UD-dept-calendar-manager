// Note- Now that I realize imports are not required in GoogleScript
// It may be better to define variables directly instead of in dict
// Define calendar description on this page as well.
// Mark public/private on calendar entries based on input?

// ###################
// Manual Entry
// ###################
const spreadsheetId = 'ID'
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
// Uses info from config page to complete variables.
// CELL REFERENCES ARE HARDCODED

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
}

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
const inputPageName = getCell('E4')
const InputSheet = spreadsheet.getSheetByName(inputPageName)
const InputPage = {
  'headingRange': getHeadingRange(InputSheet),
  'inputRange': getCell('E5'),
  'checkboxName': getCell('E6'),
  'startDate': getCell('E7'),
  'endDate': getCell('E8'),
  'eventName': getCell('E9'),
  'deptName': getCell('E10')
};

// ========================================
// ===== Information about Calendar Page ==
// ========================================
const calendarPageName = getCell('B4')
const CalendarSheet = spreadsheet.getSheetByName(calendarPageName)
const CalendarPage = {
  'headingRange': getHeadingRange(CalendarSheet),
  'allEvents': getCell('B5'),
  'eventName': getCell('B6'),
  'eventID': getCell('B7'),
  'sorting': getCell('B8'),
  'dateName': getCell('B9')
};

// ==========================================
// ===== Information about Google Calendars ==
// ==========================================
const GeneralCalendar = CalendarApp.getCalendarById(getCell('H4'));
const OperationCalendar = CalendarApp.getCalendarById(getCell('H5'));
const ResLifeCalendar = CalendarApp.getCalendarById(getCell('H6'));
const LLDCalendar = CalendarApp.getCalendarById(getCell('H7'));

// ========================================
// ===== Drop Downs =====
// ========================================
const DropDown = {
  'operations': getCell('K4'),
  'learning': getCell('K5'),
  'resLife': getCell('K6')
};
