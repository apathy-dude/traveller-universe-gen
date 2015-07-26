requirejs.config({
    paths: {
        "components": "../bower_components",
        "lodash": "../bower_components/lodash/lodash",
        "interact": "../bower_components/interact/interact"
    }
});

require(['main'], function() { console.log('main.js loaded'); });

