### ToDo

### 4.0.17
- 非兼容性更新:DependData=>RelationData，位置由ModuleData转换为BaseData的不可枚举属性
- 简化依赖相关函数，删除once等设置项，改为bind函数中传递解绑函数

### 4.0.15/16
- 非兼容性更新:DictionaryData:$createEditData=>$createEditData，后续相关调用名称优化
- 实现DefaultEditDate/DefaultEditDateRange的数据转换
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
- 优化AttrsValue/DefaultEditContent/DefaultEditDate/DefaultEditDateRange

### 4.0.8
- 非兼容性更新:添加LayoutValue/InterfaceLayoutValue，优化组件的width到$layout中
- 修正DefaultDate=>DefaultEditDate.
- 添加DefaultEditDateRange
- 升级依赖

### 4.0.4/5/6/7
- 非兼容性更新: AttributeValue => AttrsValue
- 统一$local/$attrs属性

### 4.0.2/3
- 优化Attribute/Render相关逻辑

### 4.0.1
- 基于complex-data简化逻辑，实现基本的功能
