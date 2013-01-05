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

// first start with our base view, extending dispatcher
BaseView.prototype = new Dispatcher();
BaseView.prototype.constructor = BaseView;

function BaseView()
{
    this.show = function()
    {
        this.el.style.display = '';

        // trigger a shown event
        this.trigger('shown');
    },

    this.hide = function()
    {
        this.el.style.display = 'none';

        // trigger a hidden event
        this.trigger('hidden');
    },

    this.render = function()
    {
        // do we need to compile anything?
        if (arguments[0])
        {
            // declare the element
            var el = this['templateEl'] || this.el;

            // compile and replace current HTML
            el.innerHTML = arguments[0];
        }

        // trigger a rendered event
        this.trigger('rendered');
    }
};

// inherit baseview
LoaderView.prototype = new BaseView();
LoaderView.prototype.constructor = LoaderView;

function LoaderView()
{
    // set our element
    this.el = document.getElementById('loader-view');

    this.initialize = function()
    {
        // this view is self rendering
        this.render();
    };

    this.render = function()
    {
        // super
        this.constructor.prototype.render.apply(this);

        // so on render we show it to hide the other views
        this.show();
    };

    // run!
    this.initialize();
};

ListView.prototype = new BaseView();
ListView.prototype.constructor = ListView;

function ListView()
{
    this.el = document.getElementById('list-view');

    // if there's a template container, set it
    this.templateEl = document.getElementById('list-view-container');

    // and if there's a template, get it ready
    this.template = document.getElementById('list-view-container-template').innerHTML;

    // set our collection
    this.collection = new VideoItemsCollection();

    this.initialize = function()
    {
        // populate our collection
        this.collection.fetch(this.render, this);
    },

    this.render = function()
    {
        // super
        this.constructor.prototype.render.apply(this, [
            AppHelper.renderTemplateArray(
                this.template,
                this.collection.toJSON()
            )
        ]);
    }
};

PlayerView.prototype = new BaseView();
PlayerView.prototype.constructor = PlayerView;

function PlayerView()
{
    this.el = document.getElementById('player-view');

    this.template = document.getElementById('player-view-template').innerHTML;

    // keep a ref to this view's model
    this.model = null;

    this.show = function(videoItemModel)
    {
        // set the model
        this.model = videoItemModel;

        // listen to when this view is rendered and then show it
        this.once('rendered', this.playVideo, this);

        // render the view
        this.render();
    };

    this.hide = function()
    {
        // empty the view
        this.el.innerHTML = '';

        // super
        this.constructor.prototype.hide.apply(this);
    };

    this.playVideo = function()
    {
        // apply a height fix for the player
        document.getElementById('player-view-holder-iframe').style.height = window.outerHeight - document.getElementById('player-view-header').outerHeight;

        this.constructor.prototype.show.apply(this);
    };

    this.render = function()
    {
        // super
        this.constructor.prototype.render.apply(this, [
            AppHelper.renderTemplate(
                this.template,
                this.model
            )
        ]);
    };
};

AppView.prototype = new BaseView();
AppView.prototype.constructor = AppView;

function AppView()
{
    // add router
    this.router = new AppRouter();

    // keep a reference of the app's views
    this.views = { };

    this.hideLoaderView = function()
    {
        // hide the loader
        this.views.loaderView.hide();
    };

    this.showListView = function()
    {
        // hide the player view
        this.views.playerView.hide();

        // show the list
        this.views.listView.show();

        // hide the loader
        this.views.loaderView.hide();
    };

    this.showPlayerView = function(id)
    {
        // show the loader while we wait for the video to queue
        this.views.loaderView.show();

        // hide the list
        this.views.listView.hide();

        // load the player
        this.views.playerView.show(
            this.views.listView.collection.get(id)
        );
    };

    this.startHistory = function()
    {
        // begin listening to hashchange
        this.router.initialize();
    }

    this.initialize = function()
    {
        // initilize all the app's views
        this.views.loaderView = new LoaderView();
        this.views.playerView = new PlayerView();
        this.views.listView = new ListView();

        // bind any events
        this.views.listView.on('rendered', this.showListView, this);
        this.views.listView.on('rendered', this.startHistory, this);
        this.views.playerView.on('rendered', this.hideLoaderView, this);

        // bind any routes
        this.router.on('index', this.showListView, this);
        this.router.on('video', this.showPlayerView, this);

        // start initialize list view
        this.views.listView.initialize();
    };

    // run!
    this.initialize();
};