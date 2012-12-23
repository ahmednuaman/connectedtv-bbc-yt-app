// wrap everything in a jquery fired closure
$(function()
{
    // let's set some constants
    var FEED_NEWS = encodeURIComponent('http://feeds.bbci.co.uk/news/rss.xml');
    var FEED_NUM = 20;
    var FEED_URL = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22' + FEED_NEWS + '%22&format=json&callback=?';

    // begin defining our 'classes', let's start with our models
    var NewsItemModel = function(data)
    {
        return data;
    }

    var NewsItemsCollection = function()
    {
        return [ ];
    }

    // our base view class
    var View = function(id)
    {
        var that = this;

        that.id = '#' + id;
        that.el = $(that.id);

        // check if there's a handlebars template in this view
        if (that.el.first().is('script') && that.el.first().attr('type') === 'text/x-handlebars-template')
        {
            that.template = Handlebars.compile(
                that.el.html()
            );

            that.render = function(data)
            {
                that.el.html(
                    that.template(data)
                );
            }
        }
    }

    // now our app controller
    $(function()
    {
        // set up our vars
        var newsItemsCollection;
        var views;

        // it's all based on promisies, so here goes...
        $.getJSON(FEED_URL)
        .then(function(data)
        {
            var dfd = new $.Deferred;
            var length = data.query.results.rss.channel.item.length;

            if (length > FEED_NUM)
            {
                length = FEED_NUM;
            }

            // let's build our news items and add them to our collection
            newsItemsCollection = new NewsItemsCollection;

            for (var i = 0; i < length; i++)
            {
                newsItemsCollection.push(
                    new NewsItemModel(data.query.results.rss.channel.item[i])
                );
            }

            dfd.resolve();

            return dfd;
        }).then(function()
        {
            var dfd = new $.Deferred;

            // let's prepare our views
            views = {
                newsList: new View('news-list'),
                newsItem: new View('news-item'),
                loader: new View('loader')
            }

            return dfd;
        });
    });
});