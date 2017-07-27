const double = a => ( a + a );
const sum = (a, b) => ( a + b );
const minus = (a, b) => ( a - b );
const div = (a, b) => (a / b);
const multiply = a => b => (a * b);

function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

function pipe() {
    const args = Array.from(arguments);
    return args.reduce((result, fn) => {
        console.log('result:', result);
        console.log('FN', fn)
        if (isFunction(fn)) {
            return fn.call(null, result);
        } else {
            return result;
        }
    });
}

const main = () => {
    return pipe(
        6,
        double,
        (_) => sum(10, _),
        (_) => div(_, 3),
        multiply(6),
        (_) => minus(_, 3)
    )
}

console.log(main());
