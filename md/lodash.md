拆分数组
_.chunk([0,1,2,3,5,6],2)    

创建一个新数组，将array与任何数组 或 值连接在一起。
_.concat([1,2,3,4],1)
_.concat([1,2,3,4],[12,3])


### findIndex findLastIndex
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
_.findIndex(users, function(o) { return o.user == 'barney'; });
_.findIndex(users, ['active', false]);
_.findIndex(users, { 'user': 'fred', 'active': false });
_.findIndex(users, 'active');


_.indexOf([1, 2, 1, 2], 2);
_.indexOf([1, 2, 1, 2], 2, 2);// Search from the `fromIndex`.


_.first([1, 2, 3]); // => 1
_.head([1, 2, 3]); // => 1
_.head([]); // => undefined
_.last([1, 2, 3]); // => 3

_.nth(array, 1);
_.nth(array, -2);


_.remove(array, function(n) {
  return n % 2 == 0;
});

_.tail([1, 2, 3]); // => [2, 3] 获取除了array数组第一个元素以外的全部元素。

_.union([2], [1, 2]); // => [2, 1]  创建一个按顺序排列的唯一值的数组
_.unionBy([2.1], [1.2, 2.3], Math.floor); // => [2.1, 1.2]
_.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x'); // => [{ 'x': 1 }, { 'x': 2 }]



_.uniq([2, 1, 2]); // => [2, 1] 去重


_.zip(['fred', 'barney'], [30, 40], [true, false]); // => [['fred', 30, true], ['barney', 40, false]]
_.zipObject(['a', 'b'], [1, 2]); // => { 'a': 1, 'b': 2 }
_.unzip([['fred', 30, true], ['barney', 40, false]]); // => [['fred', 'barney'], [30, 40], [true, false]]
_.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) { return a + b + c; }); // => [111, 222]



_.flatMap([1, 2], function(n){return [n,n]});// [1, 1, 2, 2] 创建一个扁平化（愚人码头注：同阶数组）的数组

_.sample([1, 2, 3, 4]); // => 2 获得一个随机元素。


var object = { 'a': 1, 'b': '2', 'c': 3 };
_.pick(object, ['a', 'c']); // => { 'a': 1, 'c': 3 } 创建一个从 object 中选中的属性的对象。

_.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) { return key + value; }); // => { 'a1': 1, 'b2': 2 }


var object = { 'a': [{ 'b': { 'c': 3 } }] };
_.set(object, 'a[0].b.c', 4); console.log(object.a[0].b.c); // => 4
_.set(object, ['x', '0', 'y', 'z'], 5); console.log(object.x[0].y.z); // => 5

var object = { 'a': 1, 'b': 2, 'c': 1 };
_.invert(object); // => { '1': 'c', '2': 'b' } key、value倒置


var object = { 'a': { 'b': 2 } };
var other = _.create({ 'a': _.create({ 'b': 2 }) });
_.has(object, 'a'); // => true
_.has(object, 'a.b'); // => true
_.has(object, ['a', 'b']); // => true
_.has(other, 'a'); // => false

var object = _.create({ 'a': _.create({ 'b': 2 }) });
_.hasIn(object, 'a'); // => true
_.hasIn(object, 'a.b'); // => true
_.hasIn(object, ['a', 'b']); // => true
_.hasIn(object, 'b'); // => false


var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
_.result(object, 'a[0].b.c1'); // => 3
_.result(object, 'a[0].b.c3', 'default'); // => 'default'   默认值

var objects = [
  { 'a': 1, 'b': 2, 'c': 3 },
  { 'a': 4, 'b': 5, 'c': 6 }
];
_.filter(objects, _.matches({ 'a': 4, 'c': 6 })); // => [{ 'a': 4, 'b': 5, 'c': 6 }]


_.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) { return key + value; }); // => { 'a1': 1, 'b2': 2 }


_.merge(object, [sources])
_.defaults(object, [sources])
_.defaultsDeep(object, [sources])

_.range([start=0], end, [step=1]) // 创建一个包含从 start 到 end，但不包含 end 本身范围数字的数组。
_.times(n, [iteratee=_.identity]) // 