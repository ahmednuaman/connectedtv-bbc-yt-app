/*
our app has two routes:
- list
- player
*/

// strict yo
'use strict';

// extend dispatcher
AppRouter.prototype = new Dispatcher();
AppRouter.prototype.constructor = AppRouter;

function AppRouter()
{
    // keep a ref
    var that = this;

    // our listeners applier
    var applyListeners = function(link)
    {
        link.onclick = function(event)
        {
            // get hash
            var hash = link.href.split('#');

            handleHashChange.apply(that, [hash[1]]);

            // try to cancel the event
            try
            {
                event.preventDefault();
            }
            catch (e)
            {
                 // otherwise just return false
                 return false;
            }
        }
    };

    // our hashchange handler
    var handleHashChange = function()
    {
        // get our hash
        var hash = arguments[0] || window.location.hash.replace('#', '');

        // pass our hash through our routes and try to find a match
        var matches;

        for (var route in this.routes)
        {
            matches = hash.match(new RegExp(route));

            if (matches)
            {
                // trigger the associated event and pass the matches to the event
                this.trigger(
                    this.routes[route],
                    Array.prototype.splice.call(matches, 1)
                );

                break;
            }
        }
    };

    // set our routes
    this.routes = {
        'video\/([^\/]+)': 'video',
        '.*': 'index'
    };

    // create our initializer
    this.initialize = function()
    {
        // check if we can use hashchange
        if ('onhashchange' in window)
        {
            window.onhashchange = function()
            {
                handleHashChange.call(that);
            };
        }
        else
        {
            // as a fallback find all <a> tags and listen to their clicks
            var as = document.getElementsByTagName('a');
            var link;

            // loop through them
            for (var i = as.length - 1; i >= 0; i--)
            {
                link = as[i];

                // apply listeners
                applyListeners(link);
            }
        }

        // finally fire hash change for deep linking
        handleHashChange.call(that);
    }
};