/*
our app has four views:
- loader
- list
- list item
- player
- and our app
*/

var LoaderView = Backbone.View.extend({
    el: $('#loader-view'),

    initialize: function()
    {
        // this view is self rendering
        this.render();
    },

    render: function()
    {
        // so on render we show it to hide the other views
        $(this.el).show();
    }
});

var ListView = Backbone.View.extend({
    el: $('#list-view'),

    collection: new VideoItemsCollection(),

    template: Handlebars.compile($('#list-view-template').html()),

    initialize: function()
    {
        // ref this
        var that = this;

        // populate our collection
        this.collection.fetch({
            success: function()
            {
                that.render();
            }
        });
    },

    render: function()
    {
        // compile
        var html = this.template({
            items: this.collection.toJSON()
        });

        // replace current HTML
        $(this.el).html(html);
    }
});

var ListItemView = Backbone.View.extend({
    initialize: function()
    {

    },

    render: function()
    {

    }
});

var AppView = Backbone.View.extend({
    el: $('body'),

    // keep a reference of the app's views
    views: { },

    initialize: function()
    {
        // initilize all the app's views
        this.views.loaderView = new LoaderView();
        this.views.listView = new ListView();
    }
});