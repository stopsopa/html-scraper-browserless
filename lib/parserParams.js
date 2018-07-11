
module.exports = query => {
    if (typeof query === 'string') {

        query = query.split('&').reduce((acc, val) => {
            var
                a       = val.split(/=/),
                key     = a.shift(),
                dec     = a.join('=')
            ;

            acc[key] = decodeURIComponent(dec).replace(/\+/g, ' ');

            return acc;
        }, {});
    }
    else {
        query = {};
    }

    return query;
};

