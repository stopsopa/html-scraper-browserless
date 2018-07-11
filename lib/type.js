
const path = require('path');

module.exports = (function (types) {
    return function (req, res, ext) {

        ext = ext || path.extname(req.url.toLowerCase().split('?')[0]).replace(/[^a-z0-9]/g, '');

        types[ext] && res.setHeader('Content-Type', types[ext]);

        return ext;
    }
}((function (type) {
    type.jpeg = type.jpg;
    return type;
}({
    html    : 'text/html; charset=utf-8',
    js      : 'application/javascript; charset=utf-8',
    css     : 'text/css; charset=utf-8',
    json    : 'application/json; charset=utf-8',
    txt     : 'text/plain; charset=utf-8',
    gif     : 'image/gif',
    bmp     : 'image/bmp',
    jpg     : 'image/jpeg',
    png     : 'image/png',
    pdf     : 'application/pdf',
    ico     : 'image/x-icon',
}))));