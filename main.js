// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function main(){
  input = new InputEntry()
  sheet = new SheetEntry()
  gcal = new GcalEntry()

  const entries = input.getEnteredData()

  for (const row of entries) {
    // Pair heading name with corresponding row value
    var curEventData = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));
    console.log(curEventData)

    // Catch Invalid Data Entry on Input Page (RED) TODO
    if (!input.validEvent(curEventData)){
      console.log("INVALID")
      continue
    }

    // Catch Duplicates on Calendar Page (or other errors) (GREEN) TODO

    // Catch Google Calendar Errors (BLUE) TODO

    // ERROR COLOR should be added in main but called via an input page function b/c it's on input page

    console.log("VALID")
    // Create Sheet Entry TODO
    // Creat Gcal Entry TODO
    // Delete Row (no increment needed because deleting row) TODO
  };
};
    

// TODO replace all console.logs with better Logger.log messages when done reformatting

// Currently working on sheets page