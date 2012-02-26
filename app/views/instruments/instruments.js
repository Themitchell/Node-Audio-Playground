var TriggerPadView = Backbone.View.extend({
    tagName: "div",
    className: "trigger"
    
    , initialize: function(options) {
        $(this.el).append("<h2>" + this.model.get('type') + "</h2>");
    }
    
    , events: {
      "click" : "sendTrigger"
    }
    
    , sendTrigger: function() {
      $(this.el).animate({ backgroundColor: "black"}, 6);
      $(this.el).animate({ backgroundColor: "white"}, 6);
    }
    
    , render: function() {
        return this;
    }
});

// var SoundSource = Backbone.View.extend({
//     tagName:    "audio",
//     className:  "instrument"
// 
//     , initialize: function(options) {
//         _.bindAll(this, 'render');
//         this.model.bind('all', this.render);
//     }
// 
//     , render: function() {
//         var trigger = new TriggerView({ model: this.model , socket: this.socket })
//         $(this.el).append("<h3>" + this.model.get('type') + "</h3>");
//         $(this.el).append(trigger.render().el);
//         
//         return this;
//     }
// });

var InstrumentView = Backbone.View.extend({
    tagName:    "li",
    className:  "instrument"

    , initialize: function(options) {
        _.bindAll(this, 'render');
        this.model.bind('all', this.render);
    }

    , render: function() {
        var trigger_pad = new TriggerPadView({ model: this.model }).render().el;
        $(this.el).append("<h3>" + this.model.get('type') + "</h3>");
        $(this.el).append(trigger_pad);      
        return this;
    }
});

var InstrumentsView = Backbone.View.extend({
    
    initialize: function(options) {
      this.socket = options.socket;
      this.model.bind('add', this.addInstrument);
    }

    , events: {
      "submit #options" : "sendInstrument"
    }

    , addInstrument: function(instrument) {
      var view = new InstrumentView({ model: instrument });
      $('#instruments').append(view.render().el);
    }

    , createInstrument: function(instrumentJSON) {
      var instrument = new models.Instrument();
      instrument.mport(instrumentJSON);
      this.model.add(instrument);
    }

    , sendInstrument: function() {
        var instrument_name = $('#options select').val();
        var instrument = new models.Instrument({ type: instrument_name });
        this.socket.emit('instrument', instrument.xport());
    }
});