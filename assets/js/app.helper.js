/*
our app has one helper:
- renderTemplate
*/

// strict yo
'use strict';

var AppHelper = {
    renderTemplate: function(template, data)
    {
        // loop through our data hash and replace elements in our template
        for (var key in data)
        {
            template = template.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
        }

        return template;
    },

    renderTemplateArray: function(template, array)
    {
        // loop through our array to render the template
        var html = [ ];
        var item;

        for (var id in array)
        {
            html.push(
                AppHelper.renderTemplate(template, array[id])
            );
        }

        return html.join("\n");
    }
};