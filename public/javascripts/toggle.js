function Toggle(type, label, class_name_prefix) {
  var self      = this;
  
  this.state    = 0;
  if (type == 'internal') {
    this.button   = $("<div class='button " + class_name_prefix + " int_label off'>" + label + "</div>");
    this.wrapper  = this.button;
  }
  else {
    this.button   = $("<div class='button off'>" + label + "</div>");
    this.wrapper  = $("<div class=\"toggle_wrapper " + class_name_prefix + " ext_label\"></div>");
    this.label    = $("<span></span>").text(label);
    this.wrapper.append(this.button);
  }
  
  function changeState() {
    if (self.state == 0) {
      self.state = 1;
      self.button.addClass('on').removeClass('off');
    } 
    else if (self.state == 1) {
      self.state = 0;
      self.button.addClass('off').removeClass('on');
    }
    return self.state
  }
  
  this.change_state = changeState;
}