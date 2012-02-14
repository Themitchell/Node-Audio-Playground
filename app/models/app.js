var AppModel = Backbone.Model.extend({
    defaults: {
        allowed_clients: 8
    },

    initialize: function() {
        this.chats = new models.ChatCollection(); 
    }
});