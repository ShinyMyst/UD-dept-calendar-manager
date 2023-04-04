startDateHeading = 'Start Date'
entryEventNameHeading = 'Topic or Contents'

function updateGcal(entryDict){
  // Filter out entries without a specific date
  if (MONTHS.includes(entryDict[startDateHeading])){
    return
  }
};

class GcalEntry {  
  constructor(entryDict) {
    this.entryDict = entryDict;
    this._processInput();
    };

  _processInput(){
    var calendar = getCalendar()
    var dates = getDateRange()
    var description = getDescription()
    var title = entryDict[entryEventNameHeading]

    if (!calendar.getEventsForDay(dates[0], {search: title}).length){
      var event = calendar.createAllDayEvent(title, ...dates);
      event.setDescription(description)    
    }
  };


  // ========================================
  // ===== Get Event Information =====
  // ========================================
  _getCalendar(entryDict){
    switch(entryDict['Department/Branch']) {
      case 'Housing Operations':
        return operationsCal

      case 'L&L Dev':
        return lldCal

      case 'Residence Life':
        return reslifeCal

      default:
        return generalCal

    }
  };

  _getDateRange(entryDict){
    START = entryDict['Start Date']
    END = entryDict['End Date']
    if (START.getTime() === END.getTime()) {
      return [entryDict['Start Date']]
    }
    return [entryDict['Start Date'], entryDict['End Date']]
  };

  _getDescription(entryDict){
    var eventDescription = `
        Category: ${entryDict['Category']}
        Staff Responsible: ${entryDict['Primary Staff Responsible']}
        Privacy: ${entryDict['Privacy']}
        Notes: ${entryDict['Notes']}
        Link: ${entryDict['Link']}
      `;
    return eventDescription
  }
};



// ###################
// Helper Functions
// ###################