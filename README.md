# Selize Utils

[English](./docs/readme/EN/README_EN.md)

这是 selize 使用的 utils 工具模块

## 安装
```sh
pnpm add selize-utils
npm install selize-utils
yarn add selize-utils
```

## 索引
| 函数 | 描述 | 参数 |
| :---: | :---: | :---: |
| [deepFreeze](./docs/ZH/modules/freeze.md) | 深度冻结一个对象，使其及其嵌套对象不可变 | object<T> |
| [snoweflake](./docs/ZH/modules/snoweflake.md) | Twitter的分布式自增ID雪花算法 | / |
| [hashFile](./docs/ZH/modules/hashFile.md) | 计算文件的哈希值 | filePath<string> |
| [hashDir](./docs/ZH/modules/hashDir.md) | 递归计算目录下的所有文件的哈希值 | dirPath<string> |