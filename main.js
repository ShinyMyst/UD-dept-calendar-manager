// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function main(){
  input = new InputEntry()
  sheet = new SheetEntry()
  gcal = new GcalEntry()

  const entries = input.getEnteredData()

  for (const row of entries) {
    console.log('=====', row[6], '=====')
    // Pair heading name with corresponding row value
    var curEventData = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));

  // ============================
  // ===== Update & Validate ====
  // ============================
    if (!input.updateData(curEventData)){
      continue
    }
    if (!sheet.updateData(curEventData)){
      input.highlightRow('orange')
      input.incrementRow()
      continue
    };
    if (!gcal.updateData(curEventData)){
      input.highlightRow('blue')
      input.incrementRow()
      continue
    };

    // ==========================
    // ===== Add Entries =====
    // ==========================
    var entry = sheet.addEvent()
    //Logger.log("Added ${entry[0]} to Sheet on entry[1]")
    var entry = gcal.addEvent()
    //Logger.log("Added ${entry[0]} to Gcal on entry[1]")
    input.deleteRow()
    //Logger.log("Deleted", row)
  };
};
    

// TODO, reformat config page
// TODO, include the temp calendars for training aviate employement
// TODO, Add dropdown options on Input Page
// TODO account for no calendar given
// TEST CASES

// BLUE ERROR - Month and Calendar is getting deleted?

// TODO replace all console.logs with better Logger.log messages when done reformatting
// TODO restructure the HEADING with just single variables
