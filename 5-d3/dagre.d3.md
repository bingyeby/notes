### 相关信息
    https://github.com/dagrejs/dagre-d3/wiki
    官方文档	

    https://blog.csdn.net/qq_30227429/article/details/79878660
    简单实例	

    https://dagrejs.github.io/project/dagre-d3/latest/demo/clusters.html
    设置节点组或区域	

### 简易代码
1. 设置节点信息
2. 设置连接线
3. 进行绘制
```js
// Create the input graph
var g = new dagreD3.graphlib.Graph()
  .setGraph({})
  .setDefaultEdgeLabel(function() { return {}; });

// Here we"re setting nodeclass, which is used by our custom drawNodes function 
g.setNode(9,  { label: "DT",        class: "type-DT" });
g.setNode(14, { label: "sentence",  class: "type-TK" });

// 设置节点框框为圆角
g.nodes().forEach(function(v) {
  var node = g.node(v);
  node.rx = node.ry = 5;
});

// Set up edges, no special attributes.
g.setEdge(3, 4);
g.setEdge(2, 3);

// Create the renderer
var render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
    svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
render(d3.select("svg g"), g);

// Center the graph 调整布局(位置)
var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
svg.attr("height", g.graph().height + 40);
```

### 总体布局 离散程度 
控制同级间的距离，不同级之间的距离。
```js
let g = new dagreD3.graphlib.Graph({ compound: true }).setGraph({
  rankdir: 'RL',// 横向展示 or 纵向展示 横向展示方向
  nodesep: 5,// 控制节点的分散程度 间距
  ranksep: 35, // 控制级别之间的距离
  marginx: 20, // 左右间距
  marginy: 20,
}).setDefaultEdgeLabel(function () {
  return {}
})
```

### 控制节点的样式 
```js
g.setNode(n.key, {
  width: 50,// 控制节点的宽度 可自适应
  height: 25, // 控制节点的高度 可自适应
  padding: 0,// 控制节点的padding

  label: n.label,// 节点名称 需要换行时，通过\n控制
  labelStyle: 'fill: red; font-size: 2em; font-weight: bold; ',// 通过样式可以控制文本的对齐方式: text-anchor: start; text-anchor: middle;

  
  style: 'stroke: blue; fill:red;' // 调整渲染后rect的样式
  
  class:'nodeType1 nodeType2 className2' // 这是节点的classname
  
  shape:'circle', // 设置节点的形状，可以为矩形、圆形... 默认为矩形框  [rect|circle]
})
```
### 控制连接线的样式
```js
g.setEdge(n.from, n.to, {
  style: 'stroke: red; fill:blue;',// 连线的颜色

  curve: d3.curveBasis, // [curveBasis|curveStep|curveStepBefore|curveStep...] https://github.com/d3/d3-shape#links
  curve: (path) => { // 可以设置不同的连接线方式
  return d3.curveBasis(path)
  },// path {_x0 : 157, _x1 : 77, _y0 : 329, _y1 : 318.05982905982904}


  arrowhead: 'vee',// 箭头的形状 [undirected|vee|normal] 无箭头 燕尾 平三角
  arrowheadStyle: 'fill: red;',// 箭头的颜色

  width: 10,
}) 
```

### 后期处理
通过d3的selectAll可以遍历获取所有的节点svg对象和节点信息,通过获取该节点对象可以添加不同的标志信息

```js
svg.selectAll('.node.rectNode').each(function (nodeKey) {// nodeKey: node的唯一性id

  // 调整rect的位置 并恢复长度
  let nodeThis = d3.select(this)
  let originWidth = this.getBBox().width // getBBox 获取整个节点的展示宽度
  nodeThis.select('rect').attr('width', originWidth).attr('transform', 'translate(-30,0)') // rect调整
  nodeThis.select('.label').select('g').attr('transform', 'translate(-50,-8)')// label文字调整

  // 根据不同的classname进行不同的操作(添加文本和标志)
  let nodeClass = d3.select(this).attr('class')
  if (/classname1/.test(nodeClass)) {
		nodeThis.append('circle')
		nodeThis.append('text')
		nodeThis.style('cursor', 'context-menu') // cursor: context-menu;
		nodeThis.on('mouseover', function () {
			d3.select(this).select('text').style('fill', 'red')
		}).on('mouseout', function (n) {
			d3.select(this).select('text').style('fill', 'red')
		})
  }
})
```

### 其他处理
```js
// 对外框框进行样式调整(偏移 长度扩大)
svg.selectAll('.cluster').each(function () {
  // 进行偏移
  let transform = d3.select(this).attr('transform')
  d3.select(this).attr('transform', transform.replace(/(?!=\()(\d+)(?=\,)/, Number(transform.match(/(?!=\()(\d+)(?=\,)/)[0]) + 100))
  // 横向扩大
  let width = d3.select(this).select('rect').attr('width') * 1
  d3.select(this).select('rect').attr('width', width + 100)
})
```

### 控制缩放
```js
let svg = d3.select('#svg'),
  inner = svg.select('g')
// Set up zoom support
let zoom = d3.zoom().on('zoom', () => {
  inner.attr('transform', d3.event.transform)
})
svg.call(zoom)
// Create the renderer
let render = new dagreD3.render()
// Run the renderer. This is what draws the final graph.
render(inner, g)

// Center the graph
let initialScale = 0.75
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr('width') - g.graph().width * initialScale) / 2, 20).scale(initialScale))
svg.attr('height', g.graph().height * initialScale + 40)

```

### 手动放大缩小设置 
```html
<div onClick={(n) => {
  let zoomValue = d3.select('#svg').property('__zoom')
  zoomValue.k = zoomValue.k * 1.1
  d3.select('#svg g').attr('transform', zoomValue)
  d3.select('#svg').property('__zoom', zoomValue)
}}> 放大
</div>
<div onClick={(n) => {
  let zoomValue = d3.select('#svg').property('__zoom').scale(0.9)
  if (zoomValue.x < 0) {
    zoomValue.x = zoomValue.x + 100
  }
  if (zoomValue.y < 0) {
    zoomValue.y = zoomValue.y - 10
  }
  d3.select('#svg g').attr('transform', zoomValue)
  d3.select('#svg').property('__zoom', zoomValue)
}}> 
</div>
<div onClick={(n) => {
  let centerTranslateY = d3.select('.center').attr('transform').match(/(?<=\,)\d+/gi) // 'translate(396.640625,147.9765625)'.match()
  centerTranslateY = centerTranslateY ? centerTranslateY[0] : 0
  let zoomY = document.querySelector('.relationShipSvgWrap').clientHeight / 2 - centerTranslateY * 0.75 // d3.select('#svg').attr('height')
  let zoomInit = d3.zoomIdentity.translate((d3.select('#svg').attr('width') - this.g.graph().width * 0.75) / 2, zoomY).scale(0.75)
  d3.select('#svg g').attr('transform', zoomInit)
  d3.select('#svg').property('__zoom', zoomInit)
}}> 缩小
</div>
```