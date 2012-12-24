// wrap everything in a jquery fired closure
$(function()
{
    // let's set some constants
    var FEED_NUM = 20;
    var FEED_URL = 'https://gdata.youtube.com/feeds/api/users/bbc/uploads?alt=json&fields=entry(id,published,link,title,content,media:group(media:content,media:thumbnail))&max-results=' + FEED_NUM + '&callback=?';

    // begin defining our 'classes', let's start with our models
    var NewsItemModel = function(data)
    {
        this.id = YT.getYTVideoId(data.id.$t);

        this.date = new Date(data.published.$t);
        this.description = data.content.$t;
        this.link = data.link[0].href;
        this.title = data.title.$t;
        this.thumb = data.media$group.media$thumbnail[0].url;
    }

    var NewsItemsCollection = function()
    {
        var collection = [ ];
        var idToIndex = { };
        var that = this;

        this.push = collection.push;

        this.at = function(index)
        {
            return collection[index];
        }

        this.get = function(id)
        {
            try
            {
                // is this result cached?
                return collection[idToIndex[id]];
            }
            catch (e)
            {
                var item;

                for (var i = collection.length - 1; i >= 0; i--)
                {
                    item = collection[i];

                    if (item.id === id)
                    {
                        // cache the result
                        idToIndex[id] = i;

                        return item;
                    }
                }
            }
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

    // some private functions
    var YT = {
        getYTVideoId: function(url)
        {
            url = url.split('/');

            return url[url.length - 1];
        }
    };

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
        })
        .then(function()
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
        })
        .done(function()
        {
            // finally populate our news list
            views.newsList.render({
                items: newsItemsCollection
            });

            // and hide our loader
            views.loader.el.hide();
        });
    });
});