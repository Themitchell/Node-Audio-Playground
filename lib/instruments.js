var self    = this;
var last_id = 0;

exports.all_entries     = new Array();
exports.accepted_types  = new Array('kick', 'snare', 'long-hat', 'short-hat', 'osc');

exports.create_identifier = function createIdentifier(type) {  
  var instrument_id = new InstrumentIdentifier(type);
  self.all_entries.push(instrument_id);
  return instrument_id;
}

exports.update_identifier = function updateIdentifier(identifier) {  
  for (var i=0; i<self.all_entries.length; i++) {
    if (self.all_entries[i].id == identifier.id) {
      self.all_entries[i] = identifier;
      console.log("Success: Instrument updated");
    }
  }
}

function InstrumentIdentifier(type) {
  last_id++;
  
  this.id                     = last_id;
  this.type                   = type;
  this.muted                  = 0;
  this.solod                  = 0;
  this.volume_fader_value     = 100;
  this.graph_eq_filter_values = new Array(-0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1); /* 12 bands for the EQ */
}