/**
 * Library for controlling an iBoot Remote Power Control device.
 *
 * @copyright
 * Copyright (c) Copyright (c) 2015 Chris Barber
 *
 * @license
 * Licensed under the terms of the MIT License
 * Please see the LICENSE included with this distribution for details.
 */

'use strict';

var net = require('net'),
    actions = {
        query: 'q',
        on:    'n',
        off:   'f',
        cycle: 'c'
    },
    responses = {
        n: 'on',
        f: 'off',
        y: 'cycle',
        u: 'busy'
    };

module.exports = iBoot;

/**
 * A class for connecting to an iBoot device.
 *
 * @class
 *
 * @param {Object} cfg - An object containing connection settings.
 * @param {String} cfg.host - The IP address or hostname of the iBoot device.
 * @param {Number} cfg.port - The port to connect to.
 * @param {String} cfg.password - The password to use when connecting.
 * @param {Number} [cfg.timeout=5000] - Connection timeout in milliseconds.
 */
function iBoot(cfg) {
    if (!cfg || typeof cfg !== 'object') {
        throw new Error('Invalid iBoot config object.');
    }

    if (!cfg.host || typeof cfg.host !== 'string' || !(cfg.host = String(cfg.host).trim())) {
        throw new Error('Invalid iBoot IP address or hostname.');
    }

    cfg.port = parseInt(cfg.port) || 80;
    if (cfg.port < 1 || cfg.port > 65535) {
        throw new Error('Invalid iBoot port: ' + cfg.port);
    }

    if (!cfg.password || typeof cfg.password !== 'string' || !(cfg.password = String(cfg.password).trim())) {
        throw new Error('Password must be a string.');
    }

    this.host = cfg.host;
    this.port = cfg.port;
    this.password = cfg.password;
    this.timeout = cfg.timeout;
}

/**
 * Supported actions.
 * @type Array
 */
iBoot.actions = Object.keys(actions);

/**
 * Connects to the iBoot device and runs the specfied command.
 *
 * @param {String} action - The action to perform. Acceptable values are "query", "on", "off", and "cycle".
 * @param {Function} callback(err, status) - A function to call after the action has been executed.
 */
iBoot.prototype.execute = function execute(action, callback) {
    var cb = function () {
        callback.apply(null, arguments);
        cb = function () {};
    };

    if (!actions[action]) {
        return cb(new Error('Invalid action "' + action + '"'));
    }

    var client = net.connect(this.port, this.host, function () {
            client.write('\x1b' + this.password + '\x1b' + actions[action] + '\r');
        }.bind(this)),
        result = null;

    client.setTimeout(this.timeout || 10000, function () {
        cb(new Error('Timed out.'));
    });

    client.on('data', function (data) {
        result = data.toString().substring(1, 2).toLowerCase();
        client.destroy();
        if (responses[result]) {
            cb(null, responses[result]);
        } else {
            cb(new Error('Unknown status "' + result + '".'));
        }
    });

    client.on('close', function () {
        if (!result) {
            cb(new Error('Connection closed without a response.'));
        }
    });

    client.on('error', function (err) {
        if (err.errno === 'ENOTFOUND') {
            cb(new Error('Invalid host "' + this.host + '"'));
        } else {
            cb(err);
        }
    }.bind(this));
};

/**
 * Queries the state of the iBoot device.
 *
 * @param {Function} callback(err, status) - A function to call with the iBoot device's status.
 */
iBoot.prototype.query = function query(callback) {
    this.execute('query', callback);
};

/**
 * Turns on the iBoot device and returns the state.
 *
 * @param {Function} callback(err, status) - A function to call after the iBoot device has been turned on.
 */
iBoot.prototype.on = function on(callback) {
    this.execute('on', callback);
};

/**
 * Turns off the iBoot device and returns the state.
 *
 * @param {Function} callback(err, status) - A function to call after the iBoot device has been turned off.
 */
iBoot.prototype.off = function off(callback) {
    this.execute('off', callback);
};

/**
 * Power cycles the iBoot device and returns the state.
 *
 * @param {Function} callback(err, status) - A function to call after the iBoot device has been power cycled.
 */
iBoot.prototype.cycle = function cycle(callback) {
    this.execute('cycle', callback);
};
