[**@selize/utils**](../README.md)

***

[@selize/utils](../globals.md) / DeepReadonly

# Type Alias: DeepReadonly\<T\>

> **DeepReadonly**\<`T`\> = `T` *extends* infer R[] ? [`DeepReadonlyArray`](DeepReadonlyArray.md)\<`R`\> : `T` *extends* `Map`\<infer K, infer V\> ? [`DeepReadonlyMap`](DeepReadonlyMap.md)\<`K`, `V`\> : `T` *extends* `Set`\<infer E\> ? [`DeepReadonlySet`](DeepReadonlySet.md)\<`E`\> : `T` *extends* `object` ? [`DeepReadonlyObject`](DeepReadonlyObject.md)\<`T`\> : `T`

Defined in: [deepFreeze.ts:8](https://github.com/snroe/snet-utils/blob/main/src/modules/deepFreeze.ts#L8)

## Type Parameters

### T

`T`
