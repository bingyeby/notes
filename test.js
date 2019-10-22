<<<<<<< HEAD
let obj = {
    2017:'1',
    2016:'11',
    2015:'12',
    key:['2015','2016','2017'],
}

obj.key.forEach((n)=>{
    console.log(obj[n])
})
=======
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

>>>>>>> 979c9963fbd2e834b0f953d3a3d1c61228c7d8a5
