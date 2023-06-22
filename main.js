// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function main(){
  input = new InputEntry()
  sheet = new SheetEntry()
  gcal = new GcalEntry()

  const entries = input.getEnteredData()

  for (const row of entries) {
    console.log("NEXT ROW")
    console.log(row[6])
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
      input.incrementRow
      continue
    };
    if (!gcal.updateData(curEventData)){
        input.highlightRow('blue')
      input.incrementRow
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
    

// TODO CURRENT ISSUE is false negative with duplication detection

// TODO replace all console.logs with better Logger.log messages when done reformatting
// TODO try excepts?
// TODO better config page
// TODO range skips last date in range
