var self    = this;
var last_id = 0;

exports.all_entries     = new Array();
exports.accepted_types  = new Array('kick', 'snare', 'long-hat', 'short-hat', 'osc');

exports.create_identifier = function createIdentifier(type) {  
  var instrument_id = new InstrumentIdentifier(type);
  self.all_entries.push(instrument_id)
  return instrument_id;
}

function InstrumentIdentifier(type) {
  last_id++;
  
  this.id       = last_id;
  this.type     = type;
  this.muted    = 0;
}