// ###################
// Input 
// ###################
class InputEntry {  
  constructor() {
    this.rowIndex = 2
  };

  // Update class parameters; return false if invalid
  updateData(eventData){
    //this.eventData = eventData
    return this._validEvent(eventData)
  }

  // Returns true if input data is valid
  _validEvent(eventData){
    switch (true) {
      // Empty Row
      case Object.values(eventData).every(value => !value):
        InputSheet.deleteRow(this.rowIndex)
        return false
      // Box Unchecked
      case !eventData[HEADING['CheckBox']]:
        this.rowIndex ++
        return false

      // ERRORS //
      // End Date before start date
      case (eventData[HEADING['EndDate']].getTime() < eventData[HEADING['StartDate']].getTime()):
        Logger.log("ERROR - End date before start date.")
        this.highlightRow('red')
        this.rowIndex ++
        return false      

      // No Start Date
      case !eventData[HEADING['StartDate']]:
        Logger.log("ERROR - No start date chosen.")
        this.highlightRow('red')
        this.rowIndex ++
        return false
      // Start time with no end time
      case ((eventData[HEADING['StartTime']] !== "") && (eventData[HEADING['EndTime']] === (""))):
        Logger.log("ERROR - Missing end time.")
        this.highlightRow('red')
        this.rowIndex ++
        return false
      // End time with no start time
      case ((eventData[HEADING['StartTime']] === "") && (eventData[HEADING['EndTime']] !== (""))):
        Logger.log("ERROR - Missing start time.")
        this.highlightRow('red')
        this.rowIndex ++
        return false
      // No Event
       case !eventData[HEADING['Event']]:
        Logger.log("ERROR - No event entered.")
        this.highlightRow('red')
        this.rowIndex ++
        return false     
      // Invalid Date
      case !(eventData[HEADING['StartDate']] instanceof Date) && !MONTHS.includes(eventData[HEADING['StartDate']]):
        Logger.log("ERROR - Invalid date")
        this.highlightRow('red')
        this.rowIndex ++
        return false
      // Time Errors
      case (
        (eventData[HEADING['StartTime']] && !(eventData[HEADING['StartTime']] instanceof Date)) ||
        (eventData[HEADING['EndTime']] && !(eventData[HEADING['EndTime']] instanceof Date))):
        Logger.log('ERROR - Invalid Time')
        this.highlightRow('red')
        this.rowIndex ++
        return false   

      case (eventData[HEADING['Calendar']] && !CALENDAR_NAME.hasOwnProperty(eventData[HEADING['Calendar']])):
        Logger.log("ERROR - Invalid calendar")
        this.highlightRow('red')
        this.rowIndex ++
        return false

      default:
        return true
    }
  };

  // Returns an array consiting of lists.  Each list contains data for a particular row.
  getEnteredData() {
    const range = InputSheet.getDataRange()
    var entries = range.getValues()
    return entries.slice(1)
    // This implementation won't return empty rows at bottom of page.
  };

  incrementRow(){
    this.rowIndex ++
  };

  deleteRow(){
    InputSheet.deleteRow(this.rowIndex)
  };

  highlightRow(colorStr){
    var range = InputSheet.getRange(this.rowIndex, 1, 1, InputSheet.getLastColumn())
    range.setBackground(colorStr)
  };

};

// TODO - further validation
// TODO - Just organize the functions a bit and this page is done.