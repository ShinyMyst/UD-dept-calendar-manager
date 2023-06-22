// ###################
// Input Class
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
      // No Start Date
      case !eventData[HEADING['StartDate']]:
        Logger.log("No start date chosen.")
        this.highlightRow('red')
        this.rowIndex ++
        return false
      // Time entered without a start or without an end
      case (!((eventData[HEADING.StartTime] !== '') ^ (eventData[HEADING.EndTime] !== ''))):
        Logger.log("Missing start or end time.")
        this.highlightRow('red')
        this.rowIndex ++
        return false


      // Time Incorrect
      // function to highlight and skip TODO
      // this.rowIndex ++ 
      // return false

      // Date Incorrect
      // function to highlight and skip TODO
      // this.rowIndex ++
      // return false

      default:
        return true
    }
  };

  // Returns an array consiting of lists.  Each list contains data for a particular row.
  getEnteredData() {
    const range = InputSheet.getDataRange()
    var entries = range.getValues()
    return entries.slice(1)
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