let _ = require('./lodash')


var users = [
    { 'user': 'barney', 'age': 36, 'active': true },
    { 'user': 'fred', 'age': 40, 'active': false },
    { 'user': 'pebbles', 'age': 1, 'active': true }
];

let rr = _.find(users, 'active')

console.log('rr', rr);

let a = {}
_.set(a, 'a[0]b.b.b')
console.log('a', JSON.stringify(a));

