# snoweflake

## 描述
Twitter的分布式自增ID雪花算法

## 参数
```ts
options: {
  workId: number,
  datacenterId: number
}
```

## 示例
```ts
const sf = new Snowflake({workId: 1, datacenterId: 1})
const id = sf.nextId()
console.log('Generated ID:', id.toString());
const parsed = sf.parseId(id);
console.log('Parsed ID:', parsed);
```

## 输出