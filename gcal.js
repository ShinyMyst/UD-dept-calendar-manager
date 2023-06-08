function updateGcal(entryDict){
  // Filter out entries without a specific date
  if (!MONTHS.includes(entryDict[HEADING['StartDate']])){
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
    //var dates = this._getDateRange()
    var dates = this._getDates()
    var description = this._getDescription()
    var title = this.entryDict[HEADING['Event']]

    if (!calendar.getEventsForDay(dates[0], {search: title}).length){
      if (this.entryDict[HEADING['StartTime']]){
        var event = calendar.createEvent(title, ...dates);
      }
      else {
        var event = calendar.createAllDayEvent(title, ...dates);
      }
      event.setDescription(description);
      Logger.log("Google Calendar.  Added Entry " + title + " " + dates);        
    }
    
    else {
      Logger.log("Google Calendar.  Duplicate Entry " + title)
    }
  };

  // ========================================
  // ===== Test Function Sort Later=====
  // ========================================

  _getDates(){
    // Pull Dates
    var startDate = new Date(this.entryDict[HEADING['StartDate']])
    var endDate = new Date(this.entryDict[HEADING['EndDate']])

    if (this.entryDict[HEADING['StartTime']]) {
      // Pull Times
      var startTime = new Date(this.entryDict[HEADING['StartTime']])
      var endTime = new Date(this.entryDict[HEADING['EndTime']])

      // Add proper time to dates
      startDate.setHours(startTime.getHours())
      startDate.setMinutes( startTime.getMinutes())
      endDate.setHours(endTime.getHours())
      endDate.setMinutes(endTime.getMinutes())
    }

    else if (startDate === endDate) {
      return [startDate]
    }
    return [startDate, endDate]
  };

  // ========================================
  // ===== Get Event Information =====
  // ========================================
  _getCalendar(){
    switch(this.entryDict[HEADING['Calendar']]) {
      case CALENDAR_NAME['Operations']:
        return CALENDAR_LINK['Operations'] 

      case CALENDAR_NAME['ResLife']:
        return CALENDAR_LINK['ResLife']

      case CALENDAR_NAME['Conferences']:
        return CALENDAR_LINK['Conferences'] 

      case CALENDAR_NAME['Training']:
        return CALENDAR_LINK['Training']

      case CALENDAR_NAME['AVIATE']:
        return CALENDAR_LINK['AVIATE'] 

      case CALENDAR_NAME['Employment']:
        return CALENDAR_LINK['Employment']
      
      default:
        return CALENDAR_LINK['General'] 
    }
  };

  _getDateRange(){
    const DAY_IN_MS = 86400000; // number of milliseconds in a day
    const START = this.entryDict[HEADING['StartDate']]
    const END = this.entryDict[HEADING['EndDate']]
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
