[**@selize/utils**](../README.md)

***

[@selize/utils](../globals.md) / deepFreeze

# Function: deepFreeze()

> **deepFreeze**\<`T`\>(`obj`): `Readonly`\<`T`\>

Defined in: [deepFreeze.ts:7](https://github.com/snroe/snet-utils/blob/6cea2672a78937294da7b51c0554e97f19e795fe/src/modules/deepFreeze.ts#L7)

深度冻结一个对象，使其及其嵌套对象不可变

## Type Parameters

### T

`T`

## Parameters

### obj

`T`

要深度冻结的对象，期望是一个键值对对象，键为字符串，值为任意

## Returns

`Readonly`\<`T`\>

返回深度冻结后的对象，保持相同的类型
