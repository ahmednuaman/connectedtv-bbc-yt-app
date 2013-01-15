// keep it strict
'use strict';

// declare our app apis
var api = {
    tv: {
        key: new Common.API.TVKeyValue(),
        plugin: new Common.API.Plugin(),
        widget: new Common.API.Widget()
    }
};