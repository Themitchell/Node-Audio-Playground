var InstrumentView = Backbone.View.extend({
    tagName: 'li',

    initialize: function(options) {
        _.bindAll(this, 'render');
        this.model.bind('all', this.render);
    },

    render: function() {
        $(this.el).append("<h2>" + this.model.get('type') + "</h2>");
        return this;
    }
});

var InstrumentsView = Backbone.View.extend({
    
    initialize: function(options) {
      this.model.bind('add', this.addInstrument);
      this.socket = options.socket;
    }

    , events: {
      "submit #options" : "sendInstrument"
    }

    , addInstrument: function(instrument) {
      var view = new InstrumentView({ model: instrument, socket: this.socket });
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