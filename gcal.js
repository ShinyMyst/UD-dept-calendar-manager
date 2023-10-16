// ###################
// Gcal
// ###################
class GcalEntry {  
  constructor() {
    this.eventData = null;
    this.calendar = null;

  };

  // Update class parameters; return false if invalid
  updateData(eventData){
    this.eventData = eventData
    this.calendar = this._getCalendar()
    return this._validEvent()
  }

  // Check if eventData is valid
  _validEvent(){
    switch (true) {
      case (this.calendar.getEventsForDay(this.eventData[HEADING['StartDate']], {search: this.eventData[HEADING['Event']]}).length > 0):
        Logger.log("Event already in Gcal.")
        return false

      default:
        return true
    }
  };


  addEvent(){
    // TODO restructure so this is only needed once
    if (MONTHS.includes(this.eventData[HEADING['StartDate']])){
      return
    }
    //var dates = this._getDateRange()
    var dates = this._getDates()
    var description = this._getDescription()
    var title = this.eventData[HEADING['Event']]

    if (this.eventData[HEADING['StartTime']]){
      var event = this.calendar.createEvent(title, ...dates);
    }
    else {
      var event = this.calendar.createAllDayEvent(title, ...dates);
    }
    event.setDescription(description);
    
    return this.eventData[HEADING['Event']], this.eventData[HEADING['StartDate']]
  };

  // ========================================
  // ===== Test Function Sort Later=====
  // ========================================
  // TODO - reorganize this funciton
  _getDates() {
    // Pull Dates
    var startDate = new Date(this.eventData[HEADING['StartDate']]);
    if (this.eventData[HEADING['EndDate']]){
      var endDate = this.eventData[HEADING['EndDate']];
    }
    else {
      var endDate = new Date(this.eventData[HEADING['StartDate']])
    }

    // Start time given
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

    else {
      endDate.setDate(endDate.getDate() + 1); // Add one to date so that it spans properly
      return [startDate, endDate];
    }



    // Start Date and End Date are equal

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

      case CALENDAR_NAME['Experimental']:
        return CALENDAR_LINK['Experimental']
      
      default:
        return CALENDAR_LINK['DeptCal'] 
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
