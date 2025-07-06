# snoweflake

## 描述
Twitter的分布式自增ID雪花算法

测试平台：
```json
{
  "操作系统": "Windows_NT",
  "操作系统版本": "Windows 11 Pro",
  "CPU型号": "AMD Ryzen 7 7500f 6-Core Processor",
  "内存总量（MB）": 65142,
  "平台": "win32"
}
```
单例测试下，每秒生成约400万ID，吞吐量测试下，25000 毫秒共生成 101,943,160 个ID

您可运行 `node ./src/tests/snoweflake.test.mjs` 自行测试

## 参数
```ts
options: {
  workId?: number, // 机器ID
  datacenterId?: number, // 数据中心ID
  epoch?: number // 纪元时间戳
}
```

## 示例
```ts
const options = {
  workId: 1,
  datacenterId: 1
  epoch:1735660800000
}
const sf = new Snowflake(options)
const id = sf.nextId()
console.log('Generated ID:', id.toString());
const parsed = sf.parseId(id);
console.log('Parsed ID:', parsed);
```

## 输出