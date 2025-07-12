[**@selize/utils v0.1.16**](../README.md)

***

[@selize/utils](../globals.md) / IncrementalHasher

# Class: IncrementalHasher

Defined in: [hash/incrementalHash.ts:15](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L15)

增量哈希计算
适用于目录结构不变，文件内容有变更的场景

## Constructors

### Constructor

> **new IncrementalHasher**(): `IncrementalHasher`

Defined in: [hash/incrementalHash.ts:20](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L20)

#### Returns

`IncrementalHasher`

## Properties

### cache

> `private` **cache**: [`DirHashCache`](../type-aliases/DirHashCache.md)

Defined in: [hash/incrementalHash.ts:16](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L16)

***

### contentHashCache

> `private` **contentHashCache**: [`ContentHashCache`](../type-aliases/ContentHashCache.md)

Defined in: [hash/incrementalHash.ts:18](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L18)

***

### mtimeCache

> `private` **mtimeCache**: [`MTimeCache`](../type-aliases/MTimeCache.md)

Defined in: [hash/incrementalHash.ts:17](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L17)

## Methods

### \_hashDir()

> `private` **\_hashDir**(`dirPath`, `options`): `Promise`\<`string`\>

Defined in: [hash/incrementalHash.ts:65](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L65)

增量哈希

#### Parameters

##### dirPath

`string`

目录路径

##### options

选项

###### algorithm

`string`

哈希算法，默认 md5

###### ext

`string`[]

白名单扩展名

###### ignoreDirs

`string`[]

忽略的目录

###### ignoreFiles?

`RegExp`

忽略的文件正则表达式

#### Returns

`Promise`\<`string`\>

***

### clearCache()

> **clearCache**(): `void`

Defined in: [hash/incrementalHash.ts:162](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L162)

清除当前缓存（用于强制重新计算）

#### Returns

`void`

***

### getCacheSize()

> **getCacheSize**(): `number`

Defined in: [hash/incrementalHash.ts:172](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L172)

获取当前缓存大小（调试用）

#### Returns

`number`

缓存大小

***

### hashDir()

> **hashDir**(`dirPath`, `options`): `Promise`\<`string`\>

Defined in: [hash/incrementalHash.ts:36](https://github.com/snroe/snet-utils/blob/main/src/modules/hash/incrementalHash.ts#L36)

增量计算目录哈希（仅重新计算变更部分）

#### Parameters

##### dirPath

`string`

目录路径

##### options

配置项

###### algorithm?

`string`

哈希算法，默认 md5

###### ext?

`string`[]

白名单扩展名

###### ignoreDirs?

`string`[]

忽略的目录

###### ignoreFiles?

`RegExp`

忽略的文件正则表达式

#### Returns

`Promise`\<`string`\>

目录哈希
