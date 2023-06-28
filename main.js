// Checks for completed entries on entry page & adds them to Calendar Page and Gcal.
function main(){
  input = new InputEntry()
  sheet = new SheetEntry()
  gcal = new GcalEntry()

  const entries = input.getEnteredData()

  for (const row of entries) {
    // Pair heading name with corresponding row value
    var curEventData = Object.fromEntries(INPUT_HEADINGS.map((key, i) => [key, row[i]]));
    Logger.log(`===== ${curEventData[HEADING['Event']]} =====`);


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
    sheet.addEvent()
    Logger.log("Added to sheet.")
    if (curEventData['Calendar']){
      gcal.addEvent()
      Logger.log("Added to Gcal")
    }
    else {
      Logger.log('No calendar requested.')
    }
    input.deleteRow()
  };
  sheet.sortSheet()
};


// MAIN SHEET
// TODO, Add dropdown options on Input Page
// Rearrange Headings and titles 

// Refactor
// TODO - Duplicates are only caught for existing entries, not those added in same batch
// TODO restructure the HEADING with just single variables
// Actually refactor code


