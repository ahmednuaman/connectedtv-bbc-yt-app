/*
our app has one model:
- video item

and one collection:
- video items
*/

// strict yo
'use strict';

var VideoItemModel = Backbone.Model.extend({
    defaults: {
        id: '',
        title: '',
        description: '',
        thumbnail: ''
    }
});

var VideoItemsCollection = Backbone.Collection.extend({
    model: VideoItemModel,

    url: 'http://gdata.youtube.com/feeds/api/users/bbc/uploads?max-results=12&alt=json&orderby=published&format=1,5,6&callback=?',

    // create our parse function to handle a response from the gdata api
    // we'll be hitting: http://gdata.youtube.com/feeds/api/users/bbc/uploads?max-results=9&alt=json&orderby=published&format=1,5,6
    parse: function(response)
    {
        var data = [ ];

        // loop through our entry and map it in the same format as our VideoItemModel
        _(response.feed.entry).forEach(function(entry)
        {
            data.push({
                id: entry.id.$t.replace('http://gdata.youtube.com/feeds/api/videos/', ''),
                title: entry.title.$t,
                description: entry.content.$t,
                thumbnail: entry.media$group.media$thumbnail[0].url
            });
        });

        return data;
    }
});