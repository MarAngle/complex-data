### TODOLIST
- 实现多选的高度扩展设置项
- $children设置项因list的接收的字段问题和当前冲突，考虑实现方法

### 2.3.4
- DictionaryList添加格式化原型选项，默认对数据的原型做单独处理添加深度信息

### 2.3.2/2.3.3
- antd设置项懒加载修正

### 2.3.1
- config的antd设置项懒加载

### 2.3.0
- func依赖升级
- 优化组件引用，避免无比要的moment引用

### 2.2.27
- func依赖升级
- 添加自定义模块，需要保证定义的组件为全局可用

### 2.2.26
- func依赖升级

### 2.2.25
- func依赖升级
- 内部函数以$开头

### 2.2.24
- func依赖升级
- DictionaryItem删除order排序字段，无合适实现方案
- 空数据对象toString返回空字符串

### 2.2.23
- func依赖升级
- 修正file的宽度
- 修改git地址到gitee

### 2.2.22
- 字典模块数据为否不进行构建

### 2.2.21
- 文本域修正，rows删除，maxLength添加

### 2.2.20
- 文本域autosize=>autoSize，添加rows

### 2.2.19
- 修正getEditData生成编辑数据时错误调用originprop的BUG

### 2.2.18
- 添加文本域

### 2.2.17
- DictionaryList的BUG修正

### 2.2.16
- func依赖升级

### 2.2.15
- func依赖升级
- EditData函数简化
- DictionaryData => DictionaryItem
- - getEditData未正确获取type的BUG
- - 删除setPropByType函数调用

### 2.2.14
- func依赖升级

### 2.2.13
- func依赖升级

### 2.2.12
- func依赖升级,printMsgAct => exportMsg
- 类调整
- - 生命周期的创建判断删除
- - buildPrintMsg => $createMsg
- - printMsg => $exportMsg
- - constructor._name => constructor.$name
- - _selfName => $selfName

### 2.2.11
- EditData修正select的检索模式下初始加载未判断limit的BUG

### 2.2.10
- func依赖升级
- Promise优化

### 2.2.8
- 删除ExtraData数据
- parent引用设置为不可枚举
- 优化字段名称

### 2.2.7
- DictionaryData的mod模块添加$children设置项，此设置项会在DictionaryList方法getPageListByModList中判断，存在则递归循环生成子数组
- func依赖升级


### 2.2.6
- 修正ListData重置分页器的错误判断逻辑
- 优化分页器生命周期触发

### 2.2.5
- 分页器数据实现自动计算总页码以及当前页码并进行合理化判断
- 分页器数据变更时通过生命周期进行对主数据的交互

### 2.2.4
- immerdiate拼写错误修正

### 2.2.3
- BaseData:updateImmerdiate暴露

### 2.2.2
- UpdateData:实现updateImmerdiate立即更新函数
- UpdateData[BUG]:load.operate取值错误以及未重置为false

### 2.2.1
- 添加过滤器数据，实现过滤
- 分页器实现接收数组并根据分页器规则截取对应数组

### 2.2.0
- func依赖升级

### 2.1.32
- 统一EditData多选处理模式
- func依赖升级

### 2.1.31
- EditData添加级联选择器cascader

### 2.1.30
- BUG修复:同步生命周期调用:首参数默认为触发生命周期的实例

### 2.1.29
- func依赖升级
- ComplexData生命周期dictionaryListUpdated=>dictionaryUpdated
- FuncData replace错误修复

### 2.1.28
- DictionaryData的func函数的默认值由为赋值到undefined赋值，可实现传递false值进行不赋值操作
- DictionaryData的func-check函数默认由检查是否等同于defaultdata更改为使用_func.isExist进行判断

### 2.1.26
- choiceData数据一致性修复

### 2.1.25
- func依赖升级
- funcEditRange函数错误返回resolveTo BUG修复

### 2.1.24
- func依赖升级

### 2.1.23
- 生命周期函数触发默认传递this为首参数
- 生成FormData相关逻辑删除异步操作部分，使用同步操作

### 2.1.22
- 修复EditData时间moment格式化时的浅拷贝出现的问题
- 修复ComplexData初始化加载DictionaryList时未调用parseDictionaryOption的BUG，优化加载DictionaryList逻辑

### 2.1.21
- ListData分页器BUG修复优化
- 分页器获取总页数函数实现

### 2.1.20
- complex-func:getRandomData函数同步调整
- IdData:id类型函数BUG修复，restart模式长度判断缺失，maxAction函数变量变更不生效，优化实现

### 2.1.19
- 依赖版本修正

### 2.1.18
- 日期范围选择器的BUG修复

### 2.1.17
- 优化实现类引用加载顺序
- 优化数据说明类，实现自动加载，获取依赖实现异步获取，避免加载顺序问题
- 说明相关prop取值从name改为_name，避免混淆
- 说明模块文件位置优化更新，数据更新
- 说明UI优化调整，减少padding/margin，减少不必要行数
- 说明暴露接口优化

### 2.1.16
- width === undefined
- format设置项默认值config
- 添加scrollWidth默认值
- 优化DictionaryData的加载，减少判断，合并函数

### 2.1.15
- 实现类优化，尽可能将属性在constructor中赋值
- parent可选加载，在简化的数据中优化性能
- initdata => initOption
- 扩展DefaultDataWithLife数据，DefaultData删除生命周期相关

### 2.1.14
- 函数注释
- typeData和timeUtils解绑
- 设置项优化

### 2.1.13
- 添加时间范围的限制字段，实现可选时间的limit限制，暂时存在time选择时的错误问题，考虑showTime状态下的数据选择问题
  - 因time相关的disabledTime可控性差，难以通过不可选模式进行时间限制，因此通过change事件进行事件限制
  - 暂时判断：eq(可相等)情况下限制条件会在相等时判断为否，通过限制判断，不可相等（默认）情况下，相等时判断为否，不通过判断
  - 考虑当type=day时，时间的限制条件以及eq的逻辑问题
- 优化type的width默认值，避免button/switch等模块width=100%时可能出现的未预期拉伸情况,und情况下默认为auto


### 2.1.12
- EditData中的rule.required默认取值required
- 删除innerWidth选项
- 删除mainwidth/width默认值
- LayoutData优化

### 2.1.10
- 修复EditData创建slot时本身prop为空的BUG

### 2.1.9
- EditData创建生命周期BUG修复
- 因代码转义，class的this.constructor.name名称将不会是定义的名称，为避免问题考虑优化方案
 - 解决方案，将class挂载_name属性

### 2.1.8
- 将reloadData函数抽取到BaseData中，通过首参数option，在beforeReload生命周期中进行各个设置项的调整
- 优化异步加载的生命周期回调参数

### 2.1.7
- getFormData整体逻辑优化
- 准备重构全局form相关函数
- modType参数名称优化
- originfromType参数名称优化
- SearchData统一函数到DictionaryKList中

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
- module实现触发内部模块指定函数,优化$selfName

### 2.0.8
- 数据类继承链条的初始化参数为否时格式化为空对象
- SearchData加载判断优化，整体函数根据加载判断优化
- 全局说明相关数据独立存在，不引用不加载

### 2.0.7
- printMsg函数统一调用complex-func中的相关函数实现逻辑的统一处理
- 全局类的$selfName函数逻辑统一，实现类实例的名称输出
- 优化全局类的toString函数，统一调用$selfName函数输出