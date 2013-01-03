/*
our app has two routes:
- list
- player
*/

var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'index',
        'video/:id', 'video'
    }
});