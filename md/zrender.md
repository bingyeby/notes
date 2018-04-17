### zrender
#### 简易demo
    var zr = zrender.init(document.getElementById('main'));
    var circle = new zrender.Circle({
        shape: { cx: 150, cy: 50, r: 40 },
        style: { fill: 'none', stroke: '#F00' }
    });
    zr.add(circle);  // 创建了一个圆心在 [150, 50] 位置，半径为 40 像素的圆，并将其添加到画布中。
    console.log(circle.shape.r); // 40 获取配置值
    circle.attr('shape', {
        r: 50 // 只更新 r。cx、cy 将保持不变。
    });


### echarts

    标题组件 title
    图例组件 legend
    视觉映射组件 visualMap
    数据区域缩放组件 dataZoom
    时间线组件 timeline

    title
    legend
    grid
    xAxis
    yAxis
    polar
    radiusAxis
    angleAxis
    radar
    dataZoom
    visualMap
    tooltip
    axisPointer
    toolbox
    brush
    geo
    parallel
    parallelAxis
    singleAxis
    timeline
    graphic
    calendar
    dataset
    aria
    series
    color
    backgroundColor
    textStyle
    animation
    animationThreshold
    animationDuration
    animationEasingUpadate
    animationDelayUpdate
    progressive
    progressiveThreshold
    blendMode
    hoverLayerThreshold
    useUTC

#### 代码触发 ECharts 中组件的行为
    myChart.dispatchAction({ type: '' }) 触发图表行为
    常用的动作和动作对应参数：http://echarts.baidu.com/api.html#action

#### 





