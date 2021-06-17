### 2.0.10
- PromiseData判断加载完成后的数据一致性，并进行回调操作
- BaseData操作中force字段默认格式化为对象

### 2.0.9
- 适配新版func,函数名称替换
- analyze=>parse作为分析相关字段名称
- resetModule=>resetOption
- IdData优化判断修复string.length只读的BUG
- Update优化，修复clear时正在进行的trigger操作会重新启动的BUG
- module实现触发内部模块指定函数,优化_selfName

### 2.0.8
- 数据类继承链条的初始化参数为否时格式化为空对象
- SearchData加载判断优化，整体函数根据加载判断优化
- 全局说明相关数据独立存在，不引用不加载

### 2.0.7
- printMsg函数统一调用complex-func中的相关函数实现逻辑的统一处理
- 全局类的_selfName函数逻辑统一，实现类实例的名称输出
- 优化全局类的toString函数，统一调用_selfName函数输出