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
        // do we need to compile anything?
        if (arguments[0])
        {
            // compile and replace current HTML
            $(this.el).html(
                this.template(arguments[0])
            );
        }

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
        // set items
        var items = {
            items: this.collection.toJSON()
        };

        // super
        this.constructor.__super__.render.apply(this, [items]);
    }
});

var PlayerView = BaseView.extend({
    el: $('#player-view'),

    template: Handlebars.compile($('#player-view-template').html()),

    initialize: function()
    {

    },

    render: function()
    {
        // super
        this.constructor.__super__.render.apply(this);
    },
});

var AppView = BaseView.extend({
    el: $('body'),

    // add router,
    router: new AppRouter(),

    // keep a reference of the app's views
    views: { },

    showListView: function()
    {
        // hide the player view
        this.views.playerView.hide();

        // hide the loader
        this.views.loaderView.hide();
    },

    showPlayerView: function(id)
    {
        // show the loader while we wait for the video to queue
        this.views.loaderView.show();

        // hide the list
        this.views.listView.hide();

        // load the player
        this.views.playerView.show(id);
    },

    initialize: function()
    {
        // ref this
        var that = this;

        // initilize all the app's views
        this.views.loaderView = new LoaderView();
        this.views.playerView = new PlayerView();
        this.views.listView = new ListView();

        // bind any events
        this.views.listView.on('rendered', this.showListView, this);

        // bind any routes
        this.router.on('route:index', this.showListView, this);
        this.router.on('route:video', this.showPlayerView, this);
    }
});