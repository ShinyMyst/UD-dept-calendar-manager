/*
UD Library Functions
Set of common functions used across multiple projects for UD.
*/

// Retrieve Data
const activeSheet = spreadsheetApp.openbyUrl(UD_SPREADSHEET_URL);
const activePage = activeSheet.getSheetByName(PAGE_NAME);
const rawData = activePage.getDataRange().getValues();

const topRow = rawData[0]; 
const DATA = rawData.slice(1);

function getColumnNumber(headerName){
// Returns the column number of given header.
// Note - Column A is indexed at 0 so add 1
    return topRow.indexOf(headerName)+1
};

function getCellData(rowData, headerName){
// Returns the data from a row associated with the given header
    const cellIndex = topRow.indexOf(headerName);
    return rowData[cellIndex]
};