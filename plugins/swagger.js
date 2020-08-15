'use strict';

import HapiSwagger from 'hapi-swagger';
const swaggerOptions = {
    pathPrefixSize: 2,
    info: {
        'title': `${process.env.APP_NAME} API Documentation`,
        'description': `${process.env.APP_NAME} API documentation.`,
        'version': '0.0.1'
    },
    documentationPath: "/swagger"
};

export function register (server, options) {
    server.register({
        plugin: HapiSwagger,
        options: swaggerOptions
    }, {}, (err) => {
        if (err) server.log(['error'], 'hapi-swagger load error: ' + err)
        else server.log(['info'], 'hapi-swagger interface loaded')
    });
}

export const name = 'swagger-plugin';
