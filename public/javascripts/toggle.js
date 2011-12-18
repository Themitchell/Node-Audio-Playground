function Toggle(init_state, type, label, class_name_prefix) {
  var self      = this;
  this.state    = init_state;
  
  
  if (type == 'internal') {
    this.button   = $("<div class='button " + class_name_prefix + " int_label " + ((this.state == 1) ? 'on' : 'off') + "'>" + label + "</div>");
    this.wrapper  = this.button;
  }
  else {
    this.button   = $("<div class='button " + ((this.state == 1) ? 'on' : 'off') + "'>" + label + "</div>");
    this.wrapper  = $("<div class=\"toggle_wrapper " + class_name_prefix + " ext_label\"></div>");
    this.label    = $("<span></span>").text(label);
    this.wrapper.append(this.button);
  }
  
  function changeState(state) {
    console.log("Changing toggle state from: " + self.state + " to: " + state);
    
    if (self.state == 0) {
      self.button.addClass('on').removeClass('off');
    } 
    else if (self.state == 1) {
      self.button.addClass('off').removeClass('on');
    }
    self.state = state;
    console.log("Toggle state changed to: " + self.state);
    return self.state
  }
  this.change_state = changeState;
}