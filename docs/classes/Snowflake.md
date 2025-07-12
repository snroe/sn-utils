[**@selize/utils v0.1.16**](../README.md)

***

[@selize/utils](../globals.md) / Snowflake

# Class: Snowflake

Defined in: [uuid/snowflake.ts:30](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L30)

Twitter's distributed auto-increment ID snowflake algorithm,

default start time: 

2025-01-01 00:00:00Z / 1735660800000

## Example

```ts
import { Snowflake } from '@selize/utils';

const sf = new Snowflake({workId: 1, datacenterId: 1, epoch: 1735660800000})
const uuid = sf.nextId()
console.log('Generated UUID:', id.toString());
// Generated UUID: 69715707826409472n

const parsed = sf.parseId(id);
console.log('Parsed ID:', parsed);
// Parsed ID:
// {
//   "timestamp": 1752282320001,
//   "datacenterId": 1,
//   "workerId": 1,
//   "sequence": 0
// }
```

## See

https://utils.selize.snroe.com/classes/uuid_snowflake.Snowflake.html

## Constructors

### Constructor

> **new Snowflake**(`options`): `Snowflake`

Defined in: [uuid/snowflake.ts:100](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L100)

Constructor

#### Parameters

##### options

Configuration Item

###### datacenterId?

`number`

Data Center ID

###### epoch?

`number`

default start time: 2025-01-01 00:00:00Z / 1735660800000

###### workerId?

`number`

Work Node ID

#### Returns

`Snowflake`

## Properties

### datacenterId

> `private` **datacenterId**: `number` = `1`

Defined in: [uuid/snowflake.ts:57](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L57)

数据中心ID(0~31)

***

### datacenterIdBits

> `private` `readonly` **datacenterIdBits**: `number` = `5`

Defined in: [uuid/snowflake.ts:40](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L40)

数据标识id所占的位数

***

### datacenterIdShift

> `private` `readonly` **datacenterIdShift**: `number`

Defined in: [uuid/snowflake.ts:83](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L83)

数据标识id向左移17位(12+5)

***

### epoch

> `private` **epoch**: `number` = `1735660800000`

Defined in: [uuid/snowflake.ts:49](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L49)

开始时间截 (2025-01-01 00:00:00)

***

### lastTimestamp

> `private` **lastTimestamp**: `number` = `-1`

Defined in: [uuid/snowflake.ts:65](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L65)

上次生成ID的时间截

***

### MAX\_UINT64

> `private` `readonly` **MAX\_UINT64**: `18446744073709551615n` = `0xFFFFFFFFFFFFFFFFn`

Defined in: [uuid/snowflake.ts:32](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L32)

***

### maxDatacenterId

> `private` `readonly` **maxDatacenterId**: `number`

Defined in: [uuid/snowflake.ts:74](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L74)

支持的最大数据标识id

***

### maxWorkerId

> `private` `readonly` **maxWorkerId**: `number`

Defined in: [uuid/snowflake.ts:70](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L70)

支持的最大机器id

***

### sequence

> `private` **sequence**: `number` = `0`

Defined in: [uuid/snowflake.ts:61](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L61)

毫秒内序列(0~4095)

***

### sequenceBits

> `private` `readonly` **sequenceBits**: `number` = `12`

Defined in: [uuid/snowflake.ts:44](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L44)

序列在id中占的位数

***

### sequenceMask

> `private` `readonly` **sequenceMask**: `number`

Defined in: [uuid/snowflake.ts:91](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L91)

生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)

***

### timestampLeftShift

> `private` `readonly` **timestampLeftShift**: `number`

Defined in: [uuid/snowflake.ts:87](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L87)

时间截向左移22位(5+5+12)

***

### totalBits

> `private` `readonly` **totalBits**: `BigInt`

Defined in: [uuid/snowflake.ts:31](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L31)

***

### workerId

> `private` **workerId**: `number` = `1`

Defined in: [uuid/snowflake.ts:53](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L53)

工作机器ID(0~31)

***

### workerIdBits

> `private` `readonly` **workerIdBits**: `number` = `5`

Defined in: [uuid/snowflake.ts:36](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L36)

机器id所占的位数

***

### workerIdShift

> `private` `readonly` **workerIdShift**: `number`

Defined in: [uuid/snowflake.ts:79](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L79)

机器ID向左移12位

## Methods

### nextId()

> **nextId**(): `bigint`

Defined in: [uuid/snowflake.ts:140](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L140)

Generate the next ID

#### Returns

`bigint`

64-bit ID

***

### parseId()

> **parseId**(`id`): `object`

Defined in: [uuid/snowflake.ts:188](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L188)

Analyze ID

#### Parameters

##### id

`bigint`

64-bit ID

#### Returns

`object`

Analysis results with:
- `timestamp`: Milliseconds since epoch
- `datacenterId`: Datacenter ID part of the Snowflake ID
- `workerId`: Worker node ID part of the Snowflake ID
- `sequence`: Sequence number for IDs generated in the same millisecond

##### datacenterId

> **datacenterId**: `number`

##### sequence

> **sequence**: `number`

##### timestamp

> **timestamp**: `number`

##### workerId

> **workerId**: `number`

#### Example

```ts
const uuid = (69715707826409472n).toBigInt();
const parsed = snowflake.parseId(uuid);
console.log('Parsed ID:', parsed);
// Parsed ID:
// {
//   "timestamp": 1752282320001,
//   "datacenterId": 1,
//   "workerId": 1,
//   "sequence": 0
// }
```

***

### tilNextMillis()

> `private` **tilNextMillis**(`lastTimestamp`): `number`

Defined in: [uuid/snowflake.ts:128](https://github.com/snroe/snet-utils/blob/main/src/modules/uuid/snowflake.ts#L128)

Block until the next millisecond,
until a new timestamp is obtained.

#### Parameters

##### lastTimestamp

`number`

The timestamp of the last generated ID

#### Returns

`number`

Current timestamp
