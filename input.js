// ###################
// Input Class
// ###################
class InputEntry {  
    constructor() {
      this.GSHEET_ENTRY = new SheetEntry()
      this.GCAL_ENTRY =  new GcalEntry()
      this.rowIndex = 2
      this._processInput()
    };
  
    _processInput(){
      const entries = getEnteredData()
      for (const row of entries) {
        // Pair heading name with corresponding row value
        var curEventData = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));
  
        if (curEventData[HEADING['CheckBox']]){ 
          this._processEvent(curEventData)
        }
        if (Object.values(curEventData).every(value => !value)){
          InputSheet.deleteRow(this.rowIndex)
        }
        else {
          this.rowIndex ++
        };
      };
      sortSheet()
    };
  
    _processEvent(eventData){
      // Checked Row
      if (eventData[HEADING['CheckBox']]){
        if (!duplicateEntry(eventData)) {
          this.GSHEET_ENTRY.updateGsheet(eventData)
          this.GCAL_ENTRY.updateGcal(eventData)
        };
        // Delete row if both of these succeed.  
        // Log a confirmation for added to sheet, added to cal, and deleted
        // Log and highlight red if duplicate entry
        // Make a validate function.  Highlights and logs errors.
        // Log successes in the processEvents
        // Delete row at the very end
        // Validate months/date.  Currently if it's just a month with no date
        // a gcal entry is NOT created.
      };
    }
  };
  
  
  
  
  // ###################
  // Helper Functions
  // ###################
  // Returns an array consiting of lists.  Each list contains data for a particular row.
  function getEnteredData() {
    const range = InputSheet.getDataRange()
    var entries = range.getValues()
    return entries.slice(1)
  };
  
  // Sorts dates in the proper order & ensures groupings are retained correctly.
  function sortSheet(){
    var lastColumn = CalendarSheet.getLastColumn();
    const range = CalendarSheet.getRange(2, 1, CalendarSheet.getLastRow() - 1, lastColumn);
    range.sort({column: lastColumn, ascending: true});
  };
  
  // Returns True if duplicate entry exists; False otherwise.
  function duplicateEntry(entryDict){
    function getEventList(){
      var eventMatrix = CalendarSheet.getRange('A:C').getValues() // This is a list of lists that include event name and dept
      var eventList = eventMatrix.map(function(row) {return row[0]}); // This is a list of event names
      return [eventList, eventMatrix]
    }
    eventName = entryDict[HEADING['Event']]
    eventCategory = entryDict[HEADING['Dept']]
    eventEntry = [eventName, eventCategory]
    const [eventList, eventMatrix] = getEventList()
    if (eventList.includes(eventName)){
      const found = eventMatrix.some(array => {
        return array.join(',') === eventEntry.join(',');
      });
      return found;
    } 
  };
  
  // Refactor duplicateEntry