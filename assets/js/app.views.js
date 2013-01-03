/*
our app has four views:
- loader
- list
- list item
- player
- and our app
*/

// first start with our base view
var BaseView = Backbone.View.extend({
    show: function()
    {
        // ref this
        var that = this;

        $(this.el).fadeIn('normal', function()
        {
            that.trigger('shown');
        });
    },

    hide: function()
    {
        // ref this
        var that = this;

        $(this.el).fadeOut('normal', function()
        {
            that.trigger('hidden');
        });
    },

    render: function()
    {
        // trigger a rendered event
        this.trigger('rendered');
    }
});

var LoaderView = BaseView.extend({
    el: $('#loader-view'),

    initialize: function()
    {
        // this view is self rendering
        this.render();
    },

    render: function()
    {
        // super
        this.constructor.__super__.render.apply(this);

        // so on render we show it to hide the other views
        $(this.el).show();
    }
});

var ListView = BaseView.extend({
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

        // super
        this.constructor.__super__.render.apply(this);
    }
});

var ListItemView = BaseView.extend({
    initialize: function()
    {

    },

    render: function()
    {
        // super
        this.constructor.__super__.render.apply(this);
    }
});

var AppView = BaseView.extend({
    el: $('body'),

    // keep a reference of the app's views
    views: { },

    initialize: function()
    {
        // ref this
        var that = this;

        // initilize all the app's views
        this.views.loaderView = new LoaderView();
        this.views.listView = new ListView();

        // bind any events
        this.views.listView.on('rendered', function()
        {
            // hide the loader
            that.views.loaderView.hide();
        });
    }
});