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

var AppView = Backbone.View.extend({
    el: $('body'),

    // keep a reference of the app's views
    views: { },

    initialize: function()
    {
        // initilize all the app's views
        this.views.loaderView = new LoaderView();
    }
});