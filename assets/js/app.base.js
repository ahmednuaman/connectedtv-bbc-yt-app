/*
our app one base class to rule them all:
- dispatcher
*/

// strict yo
'use strict';

// create our dispatcher class
function Dispatcher()
{
    // our events hash
    var events = { };

    var addCallback = function(event, callback, context)
    {
        // check for callback
        if (!callback)
        {
            throw new Error('No callback specified');
        }

        // prepend class's name
        event = this.constructor.name + event;

        // set our events hash array
        if (!events[event])
        {
            events[event] = [ ];
        }

        // add event and callback to hash
        events[event].push({
            once: arguments[3],
            callback: callback,
            context: context
        });
    };

    this.on = function(event, callback, context)
    {
        addCallback.apply(this, [event, callback, context]);
    };

    this.once = function(event, callback, context)
    {
        addCallback.apply(this, [event, callback, context, true]);
    };

    this.trigger = function(event)
    {
        // prepend class's name
        event = this.constructor.name + event;

        // go through our events hash array and trigger the callbacks
        if (events[event])
        {
            var callback;

            for (var i = events[event].length - 1; i >= 0; i--)
            {
                callback = events[event][i];

                callback.callback.apply(
                    callback.context,
                    Array.prototype.splice.call(arguments, 1)
                );

                // remove 'once' callbacks
                if (callback.once)
                {
                    events[event].splice(i, 1);
                }
            }
        }
    };
};