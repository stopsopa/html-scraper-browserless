
module.exports = ports => {

    const tmp = {};

    const resQueue = [];

    if ( ! ports || ! ports.length ) {

        throw `There is something wrong with given array of ports: ${JSON.stringify(ports)}`;
    }

    for (var i = 0, l = ports.length ; i < l ; i += 1 ) {

        if ( ! Number.isInteger(ports[i]) ) {

            throw `Given port '${ports[i]}' is not integer`;
        }

        if ( ports[i] < 1 ) {

            throw `Given port '${ports[i]}' is not bigger than 0`;
        }

        tmp[ports[i]] = true; // true -> available
    }

    const pick = () => {

        for (var i = 0, l = ports.length ; i < l ; i += 1 ) {

            if (tmp[ports[i]]) {

                tmp[ports[i]] = false;

                return ports[i];
            }
        }

        return false;
    };

    const distribute = () => {

        let t;

        while (resQueue.length) {

            t = pick();

            if (t) {

                resQueue.shift()(t);
            }
            else {

                break;
            }
        }
    };

    return {
        get: () => {

            const promise = new Promise(res => resQueue.push(res));

            distribute();

            return promise;
        },
        release: port => {

            console.log(`release port: ${port}`);

            if (Object.keys(tmp).find(p => p == port)) {

                tmp[port] = true;
            }

            distribute();
        }
    };
}