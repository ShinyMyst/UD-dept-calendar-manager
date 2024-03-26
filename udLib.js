/*
UD Library Functions
Set of common functions used across multiple projects for UD.
*/

// Retrieve Data
const activeSheet = SpreadsheetApp.openById(SHEET_ID);
const activePage = activeSheet.getSheetByName(PAGE_NAME);
const rawData = activePage.getDataRange().getValues();

const topRow = rawData[0]; 
const DATA = rawData.slice(1);

function getColumn(headerString){
  // Finds the column number of a given header
  // Column A is 1 but index is 0, so add 1
    return topRow.indexOf(headerString)+1
  };
  
function getColumn(headerString){
    // Finds the column number of a given header
    // Column A is 1 but index is 0, so add 1
      return topRow.indexOf(headerString)+1
    };
    

function formatDate(inputDate){
  // Removes the time/year from the date.
  var date = new Date(inputDate)
  var formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  return formattedDate;
};




