const pikmin = exports;

/**
 * The version of pikmin
 * @type {string}
 */
pikmin.version = require('../package.json').version;

pikmin.bind = require('./pikmin/bindings').bind;
pikmin.unbind = require('./pikmin/bindings').unbind;
pikmin.instance = require('./pikmin/instance');

pikmin.colors = require('./colors');
pikmin.Collection = require('./util/Collection');

pikmin.FileTransport = require('./pikmin/transports/File');
pikmin.ConsoleTransport = require('./pikmin/transports/Console');
pikmin.WebhookTransport = require('./pikmin/transports/Webhook');

pikmin.loggers = new pikmin.Collection();