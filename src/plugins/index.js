import inert from "@hapi/inert";
import vision from "@hapi/vision";

export default [
    inert,
    vision,
    { plugin: require('./swagger') },
    { plugin: require('./auth-token') }
];