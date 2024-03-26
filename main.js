// ###################
// Triggered Functions 
// ###################
// Triggered periodically
function main(){
  process_unpaired_events();
  process_paired_events();
};



// Triggered on edit
function update_last_edit() {
  // Update the last edited time column to match when row was last edited.
  // Update the corresponding calendar event
  // If for some reason the calendar event has a newer edit date than the spreadsheet...
};

// ###################
// Supporting Functions 
// ###################


// Checks the last edited times of spreadsheet and calendar events
// Updates information to match the most  recently updated version
function process_paired_events(){

};


function process_unpaired_events(scope){
  // Default scope should be 30 days
  // Event name is a unique key
  // Creates a list of all event names in calendars
  // Creates a list of all event names in spreadsheet
  // If event exists in one but not the other, adds a copy where it is missing
  gather_event_gcal(calendar);
  gather_event_spreadsheet();
  unpaired_events = compare_events();
  add_event_gcal();
  add_event_spreadsheet();
  // make sure to update edit times to match cal edit time
};

// Deleted calendar event caught by spreadsheet having an invalid link to event (as opposed to none)
// Deleted spreadsheet event caught by edit detection.

