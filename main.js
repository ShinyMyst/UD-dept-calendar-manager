// ###################
// Main 
// ###################
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
      Logger.log('No calendar listed.')
    }
    input.deleteRow()
  };
  sheet.sortSheet()
};


// Refactor
// TODO - Duplicates are only caught for existing entries, not those added in same batch
// Check for duplicates on Gcal
// Description not undefined
// Remove need for getCal function
// Refactor error checking
// Reorganize sheets

// Data validation - input should follow same format.  Seperate things like empty row checks if needed
// so long as color and increment row appears same as with other validations

