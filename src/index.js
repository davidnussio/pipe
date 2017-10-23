"use strict";

function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

module.exports = function pipe() {
    const args = Array.from(arguments);
    return args.reduce((result, fn) => {
        if (isFunction(fn)) {
            if (result && result.then) {
                return result.then((res) => fn.call(null, res) || result);
            } else {
                return fn.call(null, result) || result;
            }
        } else {
            return result;
        }
    });
}

