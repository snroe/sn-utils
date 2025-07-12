[**@selize/utils**](../README.md)

***

[@selize/utils](../globals.md) / Snowflake

# Class: Snowflake

Defined in: [uuid/snowflake.ts:30](https://github.com/snroe/snet-utils/blob/6cea2672a78937294da7b51c0554e97f19e795fe/src/modules/uuid/snowflake.ts#L30)

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

Defined in: [uuid/snowflake.ts:100](https://github.com/snroe/snet-utils/blob/6cea2672a78937294da7b51c0554e97f19e795fe/src/modules/uuid/snowflake.ts#L100)

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

## Methods

### nextId()

> **nextId**(): `bigint`

Defined in: [uuid/snowflake.ts:140](https://github.com/snroe/snet-utils/blob/6cea2672a78937294da7b51c0554e97f19e795fe/src/modules/uuid/snowflake.ts#L140)

Generate the next ID

#### Returns

`bigint`

64-bit ID

***

### parseId()

> **parseId**(`id`): `object`

Defined in: [uuid/snowflake.ts:188](https://github.com/snroe/snet-utils/blob/6cea2672a78937294da7b51c0554e97f19e795fe/src/modules/uuid/snowflake.ts#L188)

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
