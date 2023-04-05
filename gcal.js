function updateGcal(entryDict){
  // Filter out entries without a specific date
  if (MONTHS.includes(entryDict[InputPage['startDate']])){
    return
  }
};

class GcalEntry {  
  constructor(entryDict) {
    this.entryDict = entryDict;
    this._processInput();
    };

  _processInput(){
    var calendar = _getCalendar()
    var dates = _getDateRange()
    var description = _getDescription()
    var title = entryDict[InputPage['eventName']]

    if (!calendar.getEventsForDay(dates[0], {search: title}).length){
      var event = calendar.createAllDayEvent(title, ...dates);
      event.setDescription(EventDescription)    
    }
  }

  // ========================================
  // ===== Get Event Information =====
  // ========================================
  _getCalendar(entryDict){
    switch(entryDict[InputPage['deptName']]) {
      case DropDown['operations']:
        return operationsCal

      case DropDown['learning']:
        return lldCal

      case DropDown['resLife']:
        return reslifeCal

      default:
        return generalCal

    }
  };

  _getDateRange(entryDict){
    START = entryDict[InputPage['startDate']]
    END = entryDict[InputPage['endDate']]
    if (START.getTime() === END.getTime()) {
      return [entryDict[InputPage['startDate']]]
    }
    return [entryDict[InputPage['startDate']], entryDict[InputPage['endDate']]]
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
