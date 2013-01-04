/*
our app has four views:
- loader
- list
- list item
- player
- and our app
*/

// strict yo
'use strict';

// first start with our base view
var BaseView = Backbone.View.extend({
    show: function()
    {
        // ref this
        var that = this;

        this.$el.fadeIn('normal', function()
        {
            that.trigger('shown');
        });
    },

    hide: function()
    {
        // ref this
        var that = this;

        this.$el.fadeOut('normal', function()
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
            this.$el.html(
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
        this.$el.show();
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

    show: function(videoItemModel)
    {
        // ref this
        var that = this;

        // set the model
        this.model = videoItemModel;

        // listen to when this view is rendered and then show it
        this.once('rendered', function()
        {
            that.constructor.__super__.show.apply(that);
        });

        // render the view
        this.render();
    },

    hide: function()
    {
        // empty the view
        this.$el.empty();

        // super
        this.constructor.__super__.hide.apply(this);
    },

    render: function()
    {
        // super
        this.constructor.__super__.render.apply(this, [this.model]);
    },
});

var AppView = BaseView.extend({
    el: $('body'),

    // add router,
    router: new AppRouter(),

    // keep a reference of the app's views
    views: { },

    hideLoaderView: function()
    {
        // hide the loader
        this.views.loaderView.hide();
    },

    showListView: function()
    {
        // hide the player view
        this.views.playerView.hide();

        // show the list
        this.views.listView.show();

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
        this.views.playerView.show(
            this.views.listView.collection.get(id)
        );
    },

    startHistory: function()
    {
        // begin monitoring routes
        Backbone.history.start();
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
        this.views.listView.on('rendered', this.startHistory, this);
        this.views.playerView.on('rendered', this.hideLoaderView, this);

        // bind any routes
        this.router.on('route:index', this.showListView, this);
        this.router.on('route:video', this.showPlayerView, this);
    }
});