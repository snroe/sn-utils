[**@selize/utils v0.1.16**](../README.md)

***

[@selize/utils](../globals.md) / deepFreeze

# Function: deepFreeze()

> **deepFreeze**\<`T`\>(`obj`): `Readonly`\<`T`\>

Defined in: [deepFreeze.ts:29](https://github.com/snroe/snet-utils/blob/main/src/modules/deepFreeze.ts#L29)

Deep freeze an object, making it and its nested objects immutable.

## Type Parameters

### T

`T`

## Parameters

### obj

`T`

The object to be deeply frozen is expected to be a key-value pair object,
               where the keys are strings and the values can be anything.

## Returns

`Readonly`\<`T`\>

Return the object after deep freezing, keeping the same type.

## Remarks

This function performs a deep freeze on the object and all its nested properties.
         It also mutates the original object (frozen in place).

## Example

```ts
import { deepFreeze } from '@selize/utils';

const obj = { a: 1, b: { c: 2 } };
const frozen = deepFreeze(obj);
console.log("frozen: ", frozen);
// Output:
// {
//   a: 1,
//   b: {
//     c: 2
//   }

obj.a = 2;
// Output:
// TypeError: Cannot assign to read only property 'a' of object '#<Object>'
```

## See

https://utils.selize.snroe.com/functions/deepfreeze.deepfreeze
