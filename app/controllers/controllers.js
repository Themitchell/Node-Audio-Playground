var MessagesController = {
  init: function() {
    this.socket = io.connect('http://r2d2.local:8000');
    var mysocket = this.socket;

    this.model = new models.Messages();
    this.view = new MessagesView({
      model: this.model,
      socket: this.socket,
      el: $('#chat_wrapper')
    });
    var view = this.view;

    this.socket.on('message', function(message) {
      view.createMessage(message)
    });

    this.view.render();

    return this;
  }
};

var InstrumentsController = {
  
  init: function() {
    this.socket = io.connect('http://r2d2.local:8000');
    var mysocket = this.socket;

    this.model = new models.Instruments();
    this.view = new InstrumentsView({
      model: this.model,
      socket: this.socket,
      el: $('#instruments')
    });
    var view = this.view;

    this.socket.on('instrument', function(instrument) {
      view.createInstrument(instrument)
    });

    this.view.render();

    return this;
  }
};


$(document).ready(function () {
    window.app = InstrumentsController.init({});
});