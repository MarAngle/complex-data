### 2.1.7-beta
- getFormData整体逻辑优化
- 准备重构全局form相关函数

### 2.1.6
- devDependencies

### 2.1.5
- 因为option中引用的complex-data和实际项目中引用的不一定是同一个，导致修改无法在正式环境中实现，因此将option设置项集成在complex-data中
- 引用moment

### 2.1.4
- 修复config错误引用的BUG

### 2.1.3
- getFormData更改为异步函数
- 全局设置项提取

### 2.1.2
- SelectList优化
- SelectData实现，load加载的Select数据对象

### 2.1.1
- SelectList优化
- Module唯一识别符优化
- 函数文档

### 2.1.0
- 版本逻辑更新，非兼容更新将会在第二位表现

### 2.0.13
- 删除TS测试文件，依赖引用固定

### 2.0.12
- 删除引用,添加环境判断


### 2.0.11
- SelectList优化，实现未命中数据的自定义，整体字段和逻辑优化
- index引用修改,自动引用修改

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