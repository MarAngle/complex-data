# Complex Data

`complex-data` 是一个高度可组合、可扩展、由数据驱动的 UI 逻辑层框架。它旨在将复杂前端页面（尤其是表单、列表和数据表格）的状逻辑、数据流和交互行为，从具体的 UI 框架中解耦出来，通过一份结构化的数据（我们称之为“字典”）来进行定义和管理。

## 核心理念

- **字典驱动 (Dictionary-driven)**: UI 的结构、行为和状态不再通过手写组件模板来定义，而是通过一份可序列化的 JavaScript 对象（字典）来描述。
- **关注点分离 (Separation of Concerns)**: 框架本身是“无头 (Headless)”的，它只负责管理数据状态和业务逻辑，不关心最终的 UI 渲染。您可以将它与任何 UI 框架（如 Vue, React, Svelte 等）轻松集成。
- **组合与继承 (Composition & Inheritance)**: 通过设计精良的类继承链和灵活的功能模块组合，可以轻松构建出从简单输入框到复杂可编辑列表的任意组件。
- **内置响应式 (Built-in Reactivity)**: 框架内置了精简的响应式系统，能够自动处理组件之间的依赖关系、数据联动和状态更新。

## 主要功能

- **丰富的组件定义**: 内置了对输入框、选择器、日期选择器、文件上传、嵌套表单、可编辑列表等多种常见业务组件的逻辑支持。
- **强大的数据加载与缓存**: 组件可以配置异步数据加载逻辑，并内置了对 `localStorage` 的缓存支持，能够轻松实现远程搜索、数据持久化等功能。
- **灵活的布局系统**: 通过 `GridParse` 栅格解析器，可以方便地定义组件的布局。
- **声明式 API**: 提供了大量便捷的声明式 API，如通过简单配置即可实现复杂的日期禁用逻辑。
- **高度可扩展**: 设计了强大的自定义组件工厂 (`createCustomEdit`)，可以无缝集成任何非标准组件，并让其享受到框架的数据管理和响应式能力。
- **健壮的类型安全**: 项目由 TypeScript 编写，提供了严谨的类型定义，尤其在泛型应用上保证了复杂数据结构下的类型安全。

## 安装

```bash
npm install complex-data
```

## 快速开始

以下是一个定义简单登录表单的例子：

```typescript
import { ComplexData } from 'complex-data';

// 1. 定义表单字典
const loginDictionary = [
  {
    prop: 'username',
    name: '用户名',
    type: 'input',
    required: true
  },
  {
    prop: 'password',
    name: '密码',
    type: 'input',
    option: {
      password: true
    },
    required: true
  },
  {
    prop: 'loginBtn',
    name: '登录',
    type: 'button',
    option: {
      type: 'primary',
      onClick: (payload) => {
        // payload.form 是表单实例
        payload.form.validate().then(data => {
          console.log('表单数据:', data);
          // 在这里提交数据...
        });
      }
    }
  }
];

// 2. 创建 ComplexData 实例
const loginForm = new ComplexData({
  dictionary: loginDictionary
});

// 3. 在你的 UI 框架中渲染
//    - 遍历 loginForm.getPageList() 获取渲染列表
//    - 将每个组件的属性 (item.name, item.prop, item.$option 等) 传递给你的 UI 组件
//    - 通过 item.setValue(newValue) 更新数据
//    - 通过 item.getValue() 获取数据
//    - 监听 item.$on('change', ...) 来响应数据变化
```

## 架构概览

- `src/data/`: 定义了项目的核心数据模型基类，如 `Data`, `SimpleData`, `ComplexData`。
- `src/module/`: 封装了可复用的功能模块，如 `SearchData`, `PaginationData`, `StatusData` 等。
- `src/core/`: 包含核心的业务逻辑，如 `ComplexInfo` (单条数据) 和 `ComplexList` (数据列表)。
- `src/lib/`: 提供了一系列工具类和值对象，如 `FormValue`, `SelectValue`, `GridParse` 等。
- `src/dictionary/`: 包含了所有内置组件的定义，是整个字典系统的核心实现。

## 依赖

- [`complex-utils`](https://github.com/MarAngle/complex-utils): 提供核心的工具函数和基类。

## 贡献

欢迎提交问题 (issues) 和合并请求 (pull requests)。

## 许可证

[MIT](https://opensource.org/licenses/MIT)
