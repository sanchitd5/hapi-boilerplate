
export default [
    require('@hapi/inert'),
    require('@hapi/vision'),
    { plugin: require('./swagger') },
    { plugin: require('./good-console') },
    { plugin: require('./auth-token') }
];