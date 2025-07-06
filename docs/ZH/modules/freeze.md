# deepFreeze

## 描述
深度冻结一个对象，使其及其嵌套对象不可变

## 参数
```ts
object:{
  key1: value1,
  key2: value2
}
```

## 示例
```ts
const obj = deepFreeze({
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
});
```

## 输出