// keep it strict
'use strict';

// declare our app apis, with fallback
var api = { };

try
{
    api.tv = {
        key: new Common.API.TVKeyValue(),
        plugin: new Common.API.Plugin(),
        widget: new Common.API.Widget()
    };
}
catch (e)
{
    api.tv = {
        key: { },
        plugin: { },
        widget: {
            sendReadyEvent: function()
            {
                console.log('api.tv.widget.sendReadyEvent');
            }
        }
    };
}