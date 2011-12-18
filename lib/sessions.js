var self = this;

exports.all_entries = new Array();

exports.remove_entry = function removeEntry(entry) {
  for (var i=0; i<self.all_entries.length; i++) {
    if (self.all_entries[i] == entry) { self.all_entries.splice(i, 1); }
  }
}