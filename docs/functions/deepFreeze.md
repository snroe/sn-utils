[**@selize/utils**](../README.md)

***

[@selize/utils](../globals.md) / deepFreeze

# Function: deepFreeze()

> **deepFreeze**\<`T`\>(`obj`): [`DeepReadonly`](../type-aliases/DeepReadonly.md)\<`T`\>

Defined in: [deepFreeze.ts:41](https://github.com/snroe/snet-utils/blob/main/src/modules/deepFreeze.ts#L41)

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

[`DeepReadonly`](../type-aliases/DeepReadonly.md)\<`T`\>

Return the object after deep freezing, keeping the same type.

## Remarks

This function performs a deep freeze on the object and all its nested properties.
         It also mutates the original object (frozen in place).

## Example

```ts
import { deepFreeze } from '@selize/utils';

const obj = { 
 list: [1, 2, { nested: new Set([3, 4]) }],
 meta: new Map([['version', 1]]),
};
const frozen = deepFreeze(obj);

frozen.list[2].nested.add(5); // Output: TypeError: Cannot modify a frozen object
frozen.meta.set('version', 2); // Output: TypeError: Cannot modify a frozen object
```

## See

https://utils.selize.snroe.com/functions/deepfreeze.deepfreeze
