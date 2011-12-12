function Menu(connection, item_values) {
  var self = this;
  this.element  = $('#options');
  this.menu_items;
  
  $.each(item_values, function(i, value) {
    self.element.append("<li>" + value + "</li>");
  });
  this.menu_items = this.element.children('li');
  
  this.menu_items.click( function() {
    connection.socket.emit('sendCreateInstrument', $(this).text());
  });
}