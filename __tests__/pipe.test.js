const moment = require('moment');

const pipe = require('../');

const double = a => ( a + a );
const sum = (a, b) => ( a + b );
const minus = (a, b) => ( a - b );
const div = (a, b) => (a / b);
const multiply = a => b => (a * b);

test("Pipe math functions", () => {
    expect(pipe(
        6,
        double,
        (_) => sum(10, _),
        (_) => div(_, 3),
        Math.floor,
        multiply(6),
        (_) => minus(_, 3)
    )).toMatchSnapshot();
});

const cleanVowels = str => str.replace(/[aeiou]/ig, "");

test('Pipe string functions ', () => {
    expect(pipe(
        "Lorem ipsum dolor sit amet.",
        cleanVowels,
        (_) => _.split(""),
        (_) => _.reverse(),
        (_) => _.join("")
    )).toMatchSnapshot();
});

const accesslog = `
127.0.0.1 - - [21/Aug/2017:09:10:51 +0000] "GET / HTTP/1.1" 200 534 "" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.49 Safari/537.36"
127.0.0.1 - - [21/Aug/2017:09:10:53 +0000] "GET /admin HTTP/1.1" 200 534 "" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.49 Safari/537.36"
127.0.0.1 - - [21/Aug/2017:09:10:57 +0000] "GET / HTTP/1.1" 200 14 "" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.49 Safari/537.36"
127.0.0.1 - - [21/Aug/2017:09:10:58 +0000] "GET /admin HTTP/1.1" 200 534 "" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.49 Safari/537.36"
127.0.0.1 - - [21/Aug/2017:09:10:59 +0000] "GET /admin HTTP/1.1" 200 534 "" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.49 Safari/537.36"
`; 

const reParser = /^(\S+) (\S+) (\S+) \[([\w:/]+\s[+\-]\d{4})\] "(\S+)\s?(\S+)?\s?(\S+)?" (\d{3}|-) (\d+|-)\s?"?([^"]*)"?\s?"?([^"]*)?"?$/;

const parseLogLines = (logs) => {
    return logs.map(log => {
        const parsed = log.match(reParser);
        return {
            ipAddress: parsed[1],
            datetime: moment(parsed[4], 'DD/MMM/YYYY:HH:mm:ss ZZ'),
            method: parsed[5],
            resource: parsed[6],
            protocol: parsed[7],
            status: parsed[8],
            size: parsed[9],
            referer: parsed[10],
            userAgent: parsed[11]
        }
    });
};

const trim = str => str.trim();
const split = token => str => str.split(token);
const take = key => items => ( items.map(item => item[key]) );
const grep = rule => items => ( items.filter(item => item.indexOf(rule) !== -1) );
const wc = items => items.reduce(totals => totals + 1, 0);

test('should behave...', () => {
    expect(pipe(
        accesslog,
        trim,
        split('\n'),
        parseLogLines,
        take('resource'),
        grep('/admin'),
        wc
    )).toMatchSnapshot()
});
