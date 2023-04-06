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
      //Logger.log("CALENDAR: Added", title, "to", calendar)
      event.setDescription(description)    
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
    const START = this.entryDict[InputPage['startDate']]
    const END = this.entryDict[InputPage['endDate']]
    if (START.getTime() === END.getTime()) {
      return [this.entryDict[InputPage['startDate']]]
    }
    return [this.entryDict[InputPage['startDate']], this.entryDict[InputPage['endDate']]]
  };

  _getDescription(){
    var eventDescription = `
        Category: ${this.entryDict['Category']}
        Staff Responsible: ${this.entryDict['Primary Staff Responsible']}
        Privacy: ${this.entryDict['Privacy']}
        Notes: ${this.entryDict['Notes']}
        Link: ${this.entryDict['Link']}
      `;
    return eventDescription
  }
};
