/*
our app has two routes:
- list
- player
*/

// strict yo
'use strict';

var AppRouter = Backbone.Router.extend({
    routes: {
        'video/:id': 'video',
        '': 'index'
    }
});