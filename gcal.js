function updateGcal(entryDict){
  // Filter out entries without a specific date
  if (!MONTHS.includes(entryDict[InputPage['startDate']])){
    new GcalEntry(entryDict)
  }
};

class GcalEntry {  
  constructor(entryDict) {
    this.entryDict = entryDict;
    this._processInput();
    };

  _processInput(){
    var calendar = this._getCalendar()
    var dates = this._getDateRange()
    var description = this._getDescription()
    var title = this.entryDict[InputPage['eventName']]

    if (!calendar.getEventsForDay(dates[0], {search: title}).length){
      var event = calendar.createAllDayEvent(title, ...dates);
      event.setDescription(description)
      Logger.log("Google Calendar.  Added Entry " + title + " " + dates)
    }
    else {
      Logger.log("Google Calendar.  Duplicate Entry " + title)
    }
  }

  // ========================================
  // ===== Get Event Information =====
  // ========================================
  _getCalendar(entryDict){
    switch(this.entryDict[InputPage['deptName']]) {
      case DropDown['operations']:
        return OperationCalendar 

      case DropDown['learning']:
        return LLDCalendar 

      case DropDown['resLife']:
        return ResLifeCalendar 

      default:
        return GeneralCalendar 

    }
  };

  _getDateRange(){
    const DAY_IN_MS = 86400000; // number of milliseconds in a day
    const START = this.entryDict[InputPage['startDate']]
    const END = this.entryDict[InputPage['endDate']]
    const DAY = new Date(DAY_IN_MS);
    if (START.getTime() === END.getTime()) {
      return [START]
    }
    return [START, new Date(END.getTime() + DAY.getTime())] // Range ends at midnight so needs extra day
  };

  _getDescription(){
    var eventDescription = `
        Category: ${this.entryDict['Category']}
        Staff Responsible: ${this.entryDict['Primary Staff Responsible']}
        Description: ${this.entryDict['Description']}
      `;
    return eventDescription
  }
};
