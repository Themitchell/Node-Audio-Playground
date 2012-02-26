var MessageView = Backbone.View.extend({
    tagName: 'li',

    initialize: function(options) {
        _.bindAll(this, 'render');
        this.model.bind('all', this.render);
    },

    render: function() {
        $(this.el).html(this.model.get("username") + ": " + this.model.get("body"));
        return this;
    }
});

var MessagesView = Backbone.View.extend({
    initialize: function(options) {
      this.model.bind('add', this.addMessage);
      this.socket = options.socket;
    }

    , events: {
      "submit #message_form" : "sendMessage"
    }

    , addMessage: function(message) {
      var view = new MessageView({ model: message });
      $('#stream').append(view.render().el);
    }

    , createMessage: function(messageJSON) {
      var message = new models.Message();
      message.mport(messageJSON);
      this.model.add(message);
    }

    , sendMessage: function() {
        var message_field = $('input[name=message]');
        var message = new models.Message({ username: "A Username", body: message_field.val()});
        this.socket.emit('message', message.xport());
        message_field.val('');
    }
});