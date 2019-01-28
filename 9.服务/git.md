

### 工具
gitkraken

sourcetree

https://www.cnblogs.com/lucio110/p/8192792.html









开始 -> getDefaultProps  -> getInitState -> [componentWillMount render componentDidMount]  -> 

props改变 ->  componentWillReceiveProps - > shouldComponentUpdate -> | (true) ->  [componentWillUpdate render componentDidUpdate] -> | componentWillUnMount -> 卸载
state改变 - - - - - - - - - - - - - - - - >                          | (false) - - - - - - - - - - - - - - - - - - - - - - - - - ->  |   

