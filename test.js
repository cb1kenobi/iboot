var iBoot = require('./index');
var conn = new iBoot({
    host: process.env.HOST,
    port: process.env.PORT || 80,
    password: process.env.PASSWORD
});

function crash(err) {
    console.error(err);
    process.exit(1);
}

function off() {
    conn.off(function (err, status) {
        if (err) crash(err);
        console.info('iBoot currently ' + status);

        console.info('Power cycling in 2 seconds...');
        setTimeout(function () {
            conn.cycle(function (err, status) {
                if (err) crash(err);
                console.info('iBoot currently ' + status);
                console.info('Tests completed successfully!');
            });
        }, 2000);
    });
}

conn.query(function (err, status) {
    if (err) crash(err);
    console.info('iBoot currently ' + status);

    if (status === 'on') {
        console.info('Already on, powering off...');
        off();
    } else {
        console.info('Powering on...');
        conn.on(function (err, status) {
            if (err) crash(err);
            console.info('iBoot currently ' + status);
            console.info('Powering off in 2 seconds...');
            setTimeout(off, 2000);
        });
    }
});
