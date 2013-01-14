/*
our app has one model:
- video item

and one collection:
- video items
*/

// strict yo
'use strict';

var VideoItemModel = function(data)
{
    // explicitly set our model's props
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail
    };
};

var VideoItemsCollection = function()
{
    // keep a ref
    var that = this;

    // set up container for our models
    var models = { };

    // set our url for the data
    var dataURL = 'http://gdata.youtube.com/feeds/api/users/bbc/uploads?max-results=12&alt=json&orderby=published&format=1,5,6&callback=';

    // create a func to parse our data
    var parse = function(response, callback, context)
    {
        var feed = response.feed.entry;
        var entry;
        var model;

        for (var i = 0; i < feed.length; i++)
        {
            entry = feed[i];

            model = new VideoItemModel({
                id: entry.id.$t.replace('http://gdata.youtube.com/feeds/api/videos/', ''),
                title: entry.title.$t,
                description: entry.content.$t,
                thumbnail: entry.media$group.media$thumbnail[0].url
            });

            // add to models store
            models[model.id] = model;
        }

        // fire the callback
        callback.call(context);
    }

    // create temp func name
    var funcName = 'videoItemsCollectionParse' + (new Date()).getTime();

    // create fetch function
    this.fetch = function(callback, context)
    {
        // create a temp reference to our parse function
        window[funcName] = function(response)
        {
            return parse.apply(that, [response, callback, context]);
        };

        // load the json async'ly
        var resource = document.createElement('script');
        resource.src = dataURL + funcName;
        var script = document.getElementsByTagName('script')[0];
        script.parentNode.insertBefore(resource, script);
    };

    // create a get function for retrieving a model
    this.get = function(id)
    {
        return models[id];
    }

    // get all the data as a json hash, just return the models really!
    this.toJSON = function()
    {
        return models;
    }
};