# iboot

`iboot` is an unofficial library for controlling [Dataprobe's iBoot® Remote Power Control](http://dataprobe.com/iboot.html) device.

[![NPM](https://nodei.co/npm/iboot.png?downloads=true&stars=true)](https://nodei.co/npm/iboot/)

## Installation

```
npm install iboot
```

Note: You may way want to install this module globally if you want to use the command line
interface.

## Usage

`iboot` can be used as a command line tool or programmatically.

### Command Line

When run from the command line, you may pass in the required settings using either
command line options or environment variables:

```
$ iboot [query|on|off|cycle] --host <ip or hostname> --port <port> --password <pass> [--timeout <ms>]
```

```
$ HOST=<ip or address> PORT=<port> PASSWORD=<pass> iboot [query|on|off|cycle]
```

If you need help, just run:

```
$ iboot --help
```

### Code Example

```javascript
var iBoot = require('iboot');
var conn = new iBoot({
    host: '192.168.1.123',
    port: 80,
    password: 'secret'
});

conn.query(function (err, status) {
    console.info('iBoot currently ' + status);

    console.info('Powering on...');
    conn.on(function (err, status) {
        console.info('iBoot currently ' + status);

        console.info('Powering off in 2 seconds...');
        setTimeout(function () {
            conn.off(function (err, status) {
                console.info('iBoot currently ' + status);
            });
        }, 2000);
    });
});
```

## License

(The MIT License)

Copyright (c) 2015 Chris Barber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

iBoot® is a registered trademark of [Dataprobe, Inc](http://dataprobe.com/).
