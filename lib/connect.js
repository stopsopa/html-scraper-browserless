
const puppeteer = require('puppeteer');

module.exports = (port, timeout, log) => new Promise((res, rej) => {

    if ( ! Number.isInteger(timeout)) {

        throw `connect.js, timeout is not integer`;
    }

    const browserWSEndpoint = `ws://localhost:${port}`;

    let attempt = 0;
    let cont = true;

    setTimeout(() => {
        // log('timeout: ' + JSON.stringify(timeout))
        cont = false
    }, timeout);

    (function again() {

        // log('again', cont ? 'true' : 'false')

        if ( cont === false ) {

            return rej({
                e: `puppeteer.connect timeout`,
                attempt
            })
        }

        attempt += 1;

        log(`${attempt} attempt to connect to browserWSEndpoint: ${browserWSEndpoint}`);

        const p = puppeteer.connect({ browserWSEndpoint })

        // p.then(() => log('res'), () => log('rej'));

        p.then(res, () => setTimeout(() => again(), 300));

    }());

});