[**@selize/utils**](../README.md)

***

[@selize/utils](../globals.md) / hashDir

# Function: hashDir()

> **hashDir**(`dirPath`, `options`): `Promise`\<`string`\>

Defined in: [hash/hashDir.ts:11](https://github.com/snroe/snet-utils/blob/6cea2672a78937294da7b51c0554e97f19e795fe/src/modules/hash/hashDir.ts#L11)

递归计算整个目录的哈希

## Parameters

### dirPath

`string`

目录路径

### options

#### algorithm?

`string`

#### ext?

`string`[]

#### ignoreDirs?

`string`[]

#### ignoreFiles?

`RegExp`

## Returns

`Promise`\<`string`\>

目录的哈希
