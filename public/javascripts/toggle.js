function Toggle(label) {
  var self      = this;
  
  this.state    = 0;
  this.wrapper  = $("<div class=\"toggle_wrapper\"></div>");
  this.button   = $("<div class='button off'></div>");
  this.label    = $("<span></span>").text(label);
  this.wrapper.append(this.button);
  
  function changeState() {
    if (self.state == 0) {
      self.state = 1;
      self.button.addClass('on').removeClass('off');
    } 
    else if (self.state == 1) {
      self.state = 0;
      self.button.addClass('off').removeClass('on');
    }
  }
    
  this.button.click(function() {
    changeState();
  });
}