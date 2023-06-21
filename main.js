// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function main(){
  input = new InputEntry()
  sheet = new SheetEntry()
  gcal = new GcalEntry()

  const entries = input.getEnteredData()

  for (const row of entries) {
    // Pair heading name with corresponding row value
    var curEventData = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));

  // ============================
  // ===== Update & Validate ====
  // ============================
    if (!input.updateData(curEventData)){
      continue
    }
    if (!sheet.updateData(curEventData)){
      continue
    };
    if (!gcal.updateData(curEventData)){
      continue
    };

    // ==========================
    // ===== Add Entries =====
    // ==========================
    sheet.addEvent()
    gcal.addEvent()
    input.deleteRow()
  };
};
    

// TODO replace all console.logs with better Logger.log messages when done reformatting
// TODO try excepts?
// TODO better config page
