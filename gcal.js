class GcalEntry {  
  constructor() {
    this.eventData = null;

  };

  // Update class parameters; return false if invalid
  updateData(eventData){
    this.eventData = eventData
    return this._validEvent()
  }

  // Check if eventData is valid
  _validEvent(){
    switch (true) {
      // Add validation here
      default:
        return true
    }
  };


  addEvent(){
    var calendar = this._getCalendar()
    //var dates = this._getDateRange()
    var dates = this._getDates()
    var description = this._getDescription()
    var title = this.eventData[HEADING['Event']]

    if (!calendar.getEventsForDay(dates[0], {search: title}).length){
      if (this.eventData[HEADING['StartTime']]){
        var event = calendar.createEvent(title, ...dates);
      }
      else {
        console.log(dates)
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

  _getDates() {
    // Pull Dates
    var startDate = new Date(this.eventData[HEADING['StartDate']]);
    var endDate = new Date(this.eventData[HEADING['EndDate']]);

    if (this.eventData[HEADING['StartTime']]) {
      // Pull Times
      var startTime = new Date(this.eventData[HEADING['StartTime']]);
      var endTime = new Date(this.eventData[HEADING['EndTime']]);

      // Add proper time to dates
      startDate.setHours(startTime.getHours());
      startDate.setMinutes(startTime.getMinutes());
      endDate.setHours(endTime.getHours());
      endDate.setMinutes(endTime.getMinutes());
    }

    if (isNaN(endDate.getTime()) || endDate === '') {
      // Handle empty endDate
      return [startDate];
    } else if (startDate.getTime() === endDate.getTime()) {
      // Handle same start and end date
      return [startDate];
    }

    return [startDate, endDate];
  };


  // TODO make this more dynamic
  // ========================================
  // ===== Get Event Information =====
  // ========================================
  _getCalendar(){
    switch(this.eventData[HEADING['Calendar']]) {
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
    const START = this.eventData[HEADING['StartDate']]
    const END = this.eventData[HEADING['EndDate']]
    const DAY = new Date(DAY_IN_MS);
    if (START.getTime() === END.getTime()) {
      return [START]
    }
    return [START, new Date(END.getTime() + DAY.getTime())] // Range ends at midnight so needs extra day
  };

  _getDescription(){
    var eventDescription = `
        Category: ${this.eventData['Category']}
        Staff Responsible: ${this.eventData['Primary Staff Responsible']}
        Description: ${this.eventData['Description']}
      `;
    return eventDescription
  }
};
