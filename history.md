### ToDo
- DictionaryData中添加菜单转DictionaryValue的函数
- 考虑Edit的通用设置项和个体设置项的混合实现，试验检索接口类数据!
- 优化ObserveList通过defineReactive实现而不是之前的observe实现[实际上此实现可能会导致form在重复生成响应式时导致过多的set重写问题，暂时弃用]

### 4.2.0
- 优化函数名称，_为私有属性，理论上不对外使用，$为功能函数，理论上可对外使用，但可能存在更改逻辑的情况
- 优化整个按钮相关逻辑，统一调用链
- 优化SelectValue，适配级联数据
- 添加StorageValue本地缓存数据控制器，持续优化中
- 修正DefaultEdit在multiple时默认值为[]导致的引用问题
- 布局通过解析器加值实现，基础布局通过解析器解析基础数据，个体设置通过值来解析，实现页面的整体和个体设置
- 优化Edit的rule属性整体逻辑
- 优化DictionaryValue/DefaultMod，format=>assign,show/edit=>parse，post=>fetch
- 优化ObserveList的响应式逻辑，仅监控需要的属性，减少性能消耗
- Observe添加额外逻辑，实现冻结和解冻，隐藏参与逻辑判断，冻结的不进行逻辑判断，冻结的属性的响应式也不会被触发，由其他属性变更后解冻可触发

### 4.1.18
- 修正$triggerMethodWithStatus无函数时的状态回滚

### 4.1.15/16/17
- ComplexData修正getSize/setSize => getPageSize/setPageSize
- ButtonGroupEditOption类型修正
- Default添加editable判断是否是需要编辑的数据
- Status类型优化
- 依赖升级

### 4.1.13/14
- EditData添加simple设置项
- DefaultMod基类由Data切换为SimpleData,实现extra
- 优化PureButtonValue类型
- 修正错误icon

### 4.1.12
- SearchData的Button提前生成

### 4.1.11
- 优化ButtonValue类型

### 4.1.10
- 优化SearchData的observe传参
- 重要：FormValue由抽象类转换为实体类，避免加载顺序导致的BUG

### 4.1.9
- 优化加载编辑数据逻辑

### 4.1.8
- 升级依赖
- 实现disabledDate相关逻辑

### 4.1.4/5/6/7
- 优化检索
- 将配置项集成在类静态属性中
- 优化文件上传相关参数

### 4.1.3
- 按钮加载/禁用接收函数
- 扩展检索菜单默认值

### 4.1.2
- 优化字典构建函数
- 修正检索menu.name被非预期赋值

### 4.1.1
- 修正BaseData的triggerMethod相关逻辑BUG
- 优化检索函数的菜单默认为独立模块

### 4.1.0
- 优化函数命名规则：外部函数以字母开头，内部函数以$开头，私有函数以_开头

### 4.0.20
- 优化创建生命周期函数，通过$onCreatedLife实现生命周期创建完成回调

### 4.0.18/19
- SearchData菜单默认参数优化
- config添加formatPixel函数
- ButtonGroupEdit添加间隔设置项

### 4.0.17
- 非兼容性更新:DependData=>RelationData，位置由ModuleData转换为BaseData的不可枚举属性
- 简化依赖相关函数，删除once等设置项，改为bind函数中传递解绑函数

### 4.0.15/16
- 非兼容性更新:DictionaryData:$createEditData=>$createEditData，后续相关调用名称优化
- 实现DateEdit/DateRangeEdit的数据转换
- 扩展ComplexData的常用函数，减少后期自定义类

### 4.0.14
- 优化字段加载和文件目录，修正组件构建BUG

### 4.0.13
- 升级依赖，适配formatConfig

### 4.0.12
- BUG:修正DefaultMod相关类的初始化未正确传递parent的BUG
- BUG:修正SelectValue的初始化类型中dict错误的被标记为必填项的BUG

### 4.0.10/11
- 添加基础的Data构建格式化函数，适配不同环境
- 升级依赖，修正类型报错

### 4.0.9
- 优化AttrsValue/ContentEdit/DateEdit/DateRangeEdit

### 4.0.8
- 非兼容性更新:添加LayoutValue/InterfaceLayoutValue，优化组件的width到$layout中
- 修正DefaultDate=>DateEdit.
- 添加DateRangeEdit
- 升级依赖

### 4.0.4/5/6/7
- 非兼容性更新: AttributeValue => AttrsValue
- 统一$local/$attrs属性

### 4.0.2/3
- 优化Attribute/Render相关逻辑

### 4.0.1
- 基于complex-data简化逻辑，实现基本的功能
