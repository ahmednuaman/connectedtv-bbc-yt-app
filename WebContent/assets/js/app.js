// wrap everything in a jquery fired closure
$(function()
{
    // let's set some constants
    var FEED_NUM = 20;
    var FEED_URL = 'https://gdata.youtube.com/feeds/api/users/bbc/uploads?alt=json&fields=entry(id,published,link,title,content,media:group(media:content,media:thumbnail))&max-results=' + FEED_NUM + '&callback=?';
    var YT_HELPER = {
        getYTVideoId: function(url)
        {
            url = url.split('/');

            return url[url.length - 1];
        },

        debug: function()
        {
            console.log(arguments);
        }
    };
    var YT_PLAYER;

    // begin defining our 'classes', let's start with our models
    var NewsItemModel = function(data)
    {
        this.id = YT_HELPER.getYTVideoId(data.id.$t);

        this.date = new Date(data.published.$t);
        this.description = data.content.$t;
        this.link = data.link[0].href;
        this.title = data.title.$t;
        this.thumb = data.media$group.media$thumbnail[0].url;
    }

    var NewsItemsCollection = function()
    {
        var collection = [ ];
        var that = this;

        this.push = function(item)
        {
            collection.push(item);
        };

        this.at = function(index)
        {
            return collection[index];
        }

        this.get = function(id)
        {
            var item;

            for (var i = collection.length - 1; i >= 0; i--)
            {
                item = collection[i];

                if (item.id === id)
                {
                    return item;
                }
            }

            throw new Error('No item with ID ' + id);
        }
    }

    // our base view class
    var View = function(id)
    {
        var that = this;

        this.id = '#' + id;
        this.el = $(this.id);

        // check if there's a handlebars template in this view
        if (arguments[1] !== false)
        {
            this.template = Handlebars.compile(
                this.el.find('script').html()
            );

            this.render = function(data)
            {
                that.el.html(
                    that.template(data)
                );
            }
        }
    }

    // handlebars helpers
    // Handlebars.registerHelper('blah', function()
    // {
    //
    // });

    // now our app controller
    $(function()
    {
        // set up our vars
        var newsItemsCollection;
        var views;

        // our functions
        var handleData = function(data)
        {
            var dfd = new $.Deferred;
            var entries = data.feed.entry;
            var length = entries.length;

            if (length > FEED_NUM)
            {
                length = FEED_NUM;
            }

            // let's build our news items and add them to our collection
            newsItemsCollection = new NewsItemsCollection;

            for (var i = 0; i < length; i++)
            {
                newsItemsCollection.push(
                    new NewsItemModel(entries[i])
                );
            }

            dfd.resolve();

            return dfd;
        };

        var prepareViews = function()
        {
            var dfd = new $.Deferred;

            // let's prepare our views
            views = {
                newsList: new View('news-list'),
                newsItem: new View('news-item'),
                loader: new View('loader', false)
            }

            dfd.resolve();

            return dfd;
        };

        var showFeedList = function()
        {
            // finally populate our news list
            views.newsList.render({
                items: newsItemsCollection
            });

            // and hide our loader and news item
            views.loader.el.hide();
            views.newsItem.el.hide();
        };

        var handleHashChange = function()
            {
                var id = window.location.hash.replace('#', '');

                if (!id)
                {
                    showFeedList();
                }

                // render the news item
                views.newsItem.render(
                    newsItemsCollection.get(id)
                );

                // check if the yt player is defined or not
                try
                {
                    YT_PLAYER.loadVideoById(id, 0, 'large');
                }
                catch (e)
                {
                    YT_PLAYER = new YT.Player('news-item-player', {
                        height: '390',
                        width: '640',
                        videoId: id,
                        events: {
                          'onReady': YT_HELPER.debug,
                          'onStateChange': YT_HELPER.debug
                        }
                    });
                }

                // hide the news list
                views.newsList.el.hide();

                // show the news item
                views.newsItem.el.show();
            };

        // it's all based on promisies, so here goes...
        $.getJSON(FEED_URL)
        .then(handleData)
        .then(prepareViews)
        .then(showFeedList).done(function()
        {
            // set up hash listener
            window.onhashchange = handleHashChange;

            // fire hash change for deep linking
            window.onhashchange();
        });
    });
});