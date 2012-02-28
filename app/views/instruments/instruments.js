var TriggerPadView = Backbone.View.extend({
    tagName: "div",
    className: "trigger"
    
    , initialize: function(options) {
      
    }
    
    , events: {
        "click" : "sendTrigger"
    }
    
    , sendTrigger: function(args) {
        args.view.InstrumentsController.socket.emit('trigger', this.model)
    }
    
    , render: function() {
        return this;
    }
});

var SoundSourceView = Backbone.View.extend({
    tagName: "audio"
    
    , initialize: function(options) {
      this.el.volume = 0;
      
      this.el.src = 'samples/' + options.type + '.ogg';
      this.el.setAttribute('class', 'file');
    }
    
    // , events: {
    //     "loadedmetadata" : "inputReady"
    // }
    // 
    // , inputReady: function() {
    //     var channels      = this.mozChannels;
    //     var rate          = this.mozSampleRate;
    // }

    , render: function() {
        return this;
    }
});

var MuteView = Backbone.View.extend({
    tagName: 'div',
    className: 'toggle mute int_label'
    
    , initialize: function() {
        var init_state_class = (this.model.muted == 1) ? 'on' : 'off'
        this.$el.addClass(init_state_class);
    }
    
    , render: function() {
        return this;
    }
});

var MeterView = Backbone.View.extend({
    tagName: 'div',
    className: 'meter'
    
    , initialize: function() {
      
    }
    
    , render: function() {
        return this;
    }
});

var VolumeView = Backbone.View.extend({
    tagName: 'div',
    className: 'fader'
    
    , initialize: function() {

    }
    
    , render: function() {
        
        return this;
    }
})

var ChannelView = Backbone.View.extend({
    tagName: "div", 
    className: "channel_strip"
    
    , initialize: function(options) {
      
    }
    
    , render: function() {
        var inserts   = $("<div class=\"inserts\"></div>");
        var controls  = $("<div class='controls'></div>");
        var buttons   = $("<div class='buttons'></div>");

        
        inserts.append();
        
        var volume  = new VolumeView({ model: this.model });
        var meter   = new MeterView({});
        controls.append(volume.render().el, meter.render().el);

        var mute    = new MuteView({ model: this.model })
        buttons.append(mute.render().el);
        
        this.$el.append(controls, inserts, buttons);
        return this;
    }
});

var InstrumentView = Backbone.View.extend({
    tagName:    "li",
    className:  "instrument"

    , initialize: function(options) {
        _.bindAll(this, 'render');
        this.model.bind('all', this.render);
    }

    , render: function() {
        var trigger_pad   = new TriggerPadView({ model: this.model }).render().el;
        var sound_source  = new SoundSourceView({ type: this.model.get('type') }).render().el;
        var channel_strip = new ChannelView({ model: this.model }).render().el;

        this.$el.append("<h3>" + this.model.get('type') + "</h3>");
        this.$el.append(channel_strip, trigger_pad, sound_source);
        
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