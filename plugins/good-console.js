
 
var good = require('@hapi/good');

const goodOptions = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [
            {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            },
            {
                module: '@hapi/good-console'
            },
            'stdout'
        ]
    }
};

//Register Good Console
exports.register = function (server, options) {
    server.register({
        plugin: good,
        goodOptions
    }, {}, function (err) {
        if (err) {
            throw err;
        }
    });
};

exports.name = 'good-console-plugin';