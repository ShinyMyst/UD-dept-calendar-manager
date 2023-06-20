// ###################
// Input Class
// ###################
class InputEntry {  
  constructor() {
    this.rowIndex = 2
  };

  // Returns true if input data is valid
  validEvent(eventData){
    switch (true) {
      // Empty Row
      case Object.values(eventData).every(value => !value):
        InputSheet.deleteRow(this.rowIndex)
        return false

      // Box Unchecked
      case !eventData[HEADING['CheckBox']]:
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
};