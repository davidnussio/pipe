"use strict";

function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

module.exports = function pipe() {
    const args = Array.from(arguments);
    return args.reduce((result, fn) => {
        if (isFunction(fn)) {
            return fn.call(null, result);
        } else {
            return result;
        }
    });
}

