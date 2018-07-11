
const path = require('path');

const fs = require('fs');

const express = require('express');

var getRawBody = require('raw-body');

const auth      = require('basic-auth');

const shelljs   = require('shelljs');

const puppeteer = require('puppeteer');

const config = require(path.resolve(__dirname, 'config'));

const ports = require('./lib/ports')(config.docker.ports);

const app = express();

const args = require(path.resolve(__dirname, 'lib', 'args'))();

const tlog = require(path.resolve(__dirname, 'lib', 'tlog'));

const type = require(path.resolve(__dirname, 'lib', 'type'));

const parserParams = require(path.resolve(__dirname, 'lib', 'parserParams'));

const html =  fs.readFileSync('./form.html').toString().replace('<script type="json"></script>', '<script type="json">'+"\n"+JSON.stringify(config.defaults, null, 4)+"\n"+'</script>');

process.on("unhandledRejection", async (reason, p) => {

    process.stdout.write("unhandledRejection: Unhandled Promise Rejection, message: >>>" + JSON.stringify(reason.message)+"<<<\n");

});

let port = args.get('port') || config.port;

if ( ! port ) {

    throw `No port specified --port 8811`;
}

let tmp = args.get('tmp') || config.tmp;

if ( ! tmp ) {

    throw `No tmp directory specified --tmp ./path/to/dir`;
}

tmp = path.resolve(__dirname, tmp);

if ( ! fs.statSync(tmp).isDirectory()) {

    throw `Given path '${tmp}' in --tmp parameter is not directory, it should be directory`;
}

try {
    fs.accessSync(tmp, fs.constants.W_OK);
}
catch (e) {

    throw `Given directory '${tmp}' in --tmp parameter is writtable`;
}

let generalError = false;

port = parseInt(port, 10);

const host = '0.0.0.0';

function unique(pattern) { // node.js require('crypto').randomBytes(16).toString('hex');
    pattern || (pattern = 'xyxyxy');
    return pattern.replace(/[xy]/g,
        function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

const generateUniq = (function () {
    return () => {

        let file;
        let uniq;

        do {

            uniq = unique();

            file = path.resolve(tmp, `pdf-${uniq}.pdf`);

        } while (fs.existsSync(file));

        return {
            file,
            uniq
        };
    };
}())

app.all('/html-scraper-ping', (req, res) => {

    if (generalError) {

        res.statusCode = 500;

        res.setHeader('Content-type', 'application/json; charset=utf-8');

        return res.end(JSON.stringify(generalError, null, 4));
    }

    return res.end('ok');
});


const stopContainer = name => {

    return new Promise((res, rej) => {

        const stop = `
docker rm --force ${name} > /dev/null               
`.trim();

        tlog(stop);

        shelljs.exec(stop, function(code, stdout, stderr) {
            tlog(`stop code: ${name}` + code);
            (code === 0) ? res() : rej({
                stdout,
                stderr
            })
        });
    });
}

app.use((req, res) => {

    const tl = (function () {
        const ruq = unique() + ' ';
        return function () {
            tlog.apply(this, [ruq].concat(Array.prototype.slice.call(arguments)))
        };
    }(tlog));

    const pathname = (function () {
        return req.url.split('?')[0];
    }());

    if (/^\/js\//.test(pathname)) {

        var file = path.resolve(__dirname, '.' + path.sep + (decodeURI(pathname).replace(/\.\.+/g, '.')));

        tl(`-=STATIC FILE=-: ${file}`);

        if (fs.existsSync(file)) {

            try {

                return res.end(fs.readFileSync(file), type(req, res));
            }
            catch (e) {

                return res.end(JSON.stringify({
                    message: 'No access to file...',
                    file,
                    e: e.toString()
                }));
            }
        }
    }

    getRawBody(req).then(function (buf) {

        let parsed;

        try {

            // expecting here: {
            //     "url": "",
            //     "launch": {
            //     },
            //     "pdf": {
            //         "printBackground": true,
            //             "format": "A4",
            //             "margin": {
            //             "top": 0,
            //                 "right": 0,
            //                 "bottom": 0,
            //                 "left": 0
            //         },
            //         "scale": 0.7
            //     }
            // }
            parsed = JSON.parse(buf.toString());
        }
        catch (e) {

            // here I'm expecting:
            // "url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F22907231%2Fcopying-files-from-host-to-docker-container&json=%7B%22launch%22%3A%7B%7D%2C%22pdf%22%3A%7B%22printBackground%22%3Atrue%2C%22format....
            // post form field "url" and separately "json"
            // but at the end I'm combining this to format that is visible in try higher

            parsed = parserParams(buf.toString());

            // ll('parsed')
            // ll(parsed)

            if (parsed.json && typeof parsed.json == 'string') {

                try {

                    parsed.json = JSON.parse(parsed.json);

                    parsed = Object.assign({}, {
                        url: parsed.url
                    }, parsed.json);
                }
                catch (e) {

                }
            }
        }

        var credentials = auth(req);

        if (!credentials || credentials.name !== config.basicAuth.name || credentials.pass !== config.basicAuth.password) {

            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="User and password please"')
            res.end('Access denied');

            return next();
        }

        const jsonResponse = json => {

            if (json.error) {

                res.statusCode = 500;
            }

            try {
                res.setHeader('Content-type', 'application/json; charset=utf-8');
            }
            catch (e) {
            }

            res.end(JSON.stringify(json, null, 4));
        }

        const stop = (container, cause, e) => stopContainer(container).then(() => {
            return jsonResponse({
                error: cause,
                promise: 'then',
                e: (e || '').toString()
            });
        }, ee => {
            return jsonResponse({
                error: 'code != 0',
                promise: 'catch',
                e: (e || '').toString(),
                ee: (ee || '').toString(),
            });
        });

        tl('-=NEW URL=-: ' + req.url);

        if (pathname !== '/generate') {

            tl(`suggested redirect ('${pathname}') to /generate`);

            res.setHeader('Content-type', 'text/html; charset=UTF-8');

            res.end(`The only endpoint handled is <a href="/generate">/generate</a>`);

            return next();
        }

        let sel;

        try {

            let query = parserParams(req.url.split('?')[1]);

            let purl = (function () {
                try {
                    return parsed.url;
                }
                catch (e) {}
            }());

            if (query.url) {

                purl = query.url;
            }

            if ( ! purl ) {

                return res.end(html);
            }

            tl(`generating pdf from page: ${purl}`);

            if ( ! /^https?:\/\/.+/.test(purl) ) {

                tl(purl + ' : url is not valid');

                return jsonResponse({
                    error: `given url parameter (${purl}) is not valid URL`
                });
            };

            const json = (function ({ url, launch, pdf }) {

                const filteredLaunch = {};

                if (launch && launch.timeout) {

                    filteredLaunch.timeout = launch.timeout;
                }

                const config = JSON.stringify({
                    url,
                    pdf,
                    launch: filteredLaunch
                });

                tl(`config: '${config}'`);

                // https://stackoverflow.com/a/6182519/5560682
                return Buffer.from(config).toString('base64');

            }(parsed));

            try {

                ports.get().then(port => {

                    const un = generateUniq();

                    const container = `pup-pdf-${un.uniq}`;

                    const dockerrun = `
docker run -d --rm --name ${container} -v "${__dirname}:/var/app/runtime" --shm-size=1gb -p ${port}:3000 ${config.docker.image} > /dev/null               
                    `.trim();

                    tl(dockerrun);

                    // const cmd = `printf '${json}' | /bin/bash pdf.sh "${purl}"`;

                    // tl(`cmd: '${cmd}'`);

                    sel = shelljs.exec(dockerrun, function(code, stdout, stderr) {

                        tl(`code: ${code}`);

                        // return res.end(JSON.stringify({code, stdout, stderr}));

                        if (code != 0) {

                            generalError = purl + ':1:' + (dockerrun).toString() + ':: stderr>>>' + stderr + '<<< stout>>>' + stdout + '<<<';

                            tl(`executing command '${dockerrun}' failed, exit code: '${sel.code}'`);

                            const data = {
                                error: `processing url '${purl}' failed`,
                                stdout: stdout.split(/\n/),
                                stderr: stderr.split(/\n/),
                            };

                            if (JSON.stringify(data).toLocaleLowerCase().indexOf('>>>>docker') > -1) {

                                generalError = {
                                    time: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                                    json: data
                                }
                            }

                            return stop(container, 'code != 0').then(() => ports.release(port))
                        }

                        const browserWSEndpoint = `ws://localhost:${port}`;

                        tl('browserWSEndpoint: ' + browserWSEndpoint)

                        setTimeout(() => {

                            puppeteer.connect({
                                browserWSEndpoint
                            })
                                .then(async browser => {

                                    try {

                                        const file = un.file;

                                        const page = await browser.newPage();

                                        const scrap = async () => {

                                            try {

                                                tl(`before page.content()`);

                                                const html = await page.content();

                                                tl(`after page.content()`);

                                                return html + '';
                                            }
                                            catch (e) {

                                                generalError = purl + ':2:' + (e || '').toString();

                                                return stop(container, 'scrap', e).then(() => ports.release(port));
                                            }
                                        }

                                        page.setDefaultNavigationTimeout(config.timeout);

                                        // process.on("unhandledRejection", async (reason, p) => {
                                        //
                                        //     process.stdout.write("unhandledRejection: Unhandled Promise Rejection, message: >>>" + JSON.stringify(reason.message)+"<<<\n");
                                        //
                                        //     return await scrap();
                                        // });

                                        const waitUntil = [
                                            'load',
                                            'domcontentloaded',
                                            'networkidle0',
                                            'networkidle2',
                                        ]

                                        tl(`before goto ${purl}`);

                                        await page.goto(purl, { waitUntil });

                                        tl(`before regular scrap`);

                                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

                                        res.end(await scrap());

                                        generalError = false;

                                        return stop(container, 'success').then(() => ports.release(port));
                                    }
                                    catch (e) {

                                        generalError = purl + ':3:' + (e || '').toString();

                                        return stop(container, 'puppeteer.connect', e).then(() => ports.release(port));
                                    }
                                }, e => {

                                    generalError = purl + ':4:' + (e || '').toString();

                                    return stop(container, 'puppeteer.connect', e).then(() => ports.release(port));
                                })
                            ;
                        }, 1000);
                    });

                });
            }
            catch (e) {

                generalError = purl + ':5:' + (e || '').toString();

                tl('exception:');

                return jsonResponse({
                    error: 'innerCatch',
                    exception: e.toString()
                });
            }
        }
        catch (e) {

            return jsonResponse({
                error: e.toString(),
                status: sel.status
            });
        }

    })
    .catch(function (err) {

        generalError = (err || '').toString();

        res.statusCode = 500
        res.end(err.message)
    });
})

app.listen(port, host, () => {

    console.log(`\n 🌎  Server is running ` + `${host}:${port}\n`)
});
