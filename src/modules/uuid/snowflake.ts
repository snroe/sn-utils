/**
 * Twitter's distributed auto-increment ID snowflake algorithm({@link https://github.com/twitter/snowflake}),
 * 
 * default start time: 
 * 
 * 2025-01-01 00:00:00Z / 1735660800000
 * @example
 * ```ts
 * import { Snowflake } from '@selize/utils';
 *
 * const sf = new Snowflake({workId: 1, datacenterId: 1, epoch: 1735660800000})
 * const uuid = sf.nextId()
 * console.log('Generated UUID:', id.toString());
 * // Generated UUID: 69715707826409472n
 *
 * const parsed = sf.parseId(id);
 * console.log('Parsed ID:', parsed);
 * // Parsed ID:
 * // {
 * //   "timestamp": 1752282320001,
 * //   "datacenterId": 1,
 * //   "workerId": 1,
 * //   "sequence": 0
 * // }
 * ```
 *
 * @see https://utils.selize.snroe.com/classes/uuid_snowflake.Snowflake.html
 */
export class Snowflake {
  private readonly totalBits: BigInt = BigInt(64);
  private readonly MAX_UINT64 = 0xFFFFFFFFFFFFFFFFn;
  /**
   * The number of bits occupied by the machine ID
   */
  private readonly workerIdBits: number = 5;
  /**
   * The number of bits occupied by the data identifier ID
   */
  private readonly datacenterIdBits: number = 5;
  /**
   * The number of digits occupied by the sequence in the ID
   */
  private readonly sequenceBits: number = 12;

  /**
   * Start time cut-off (2025-01-01 00:00:00)
   */
  private epoch: number = 1735660800000;
  /**
   * Work machine ID (0~31)
   */
  private workerId: number = 1;
  /**
   * Data center ID (0~31)
   */
  private datacenterId: number = 1;
  /**
   * Millisecond sequence (0~4095)
   */
  private sequence: number = 0;
  /**
   * The timestamp of the last generated ID
   */
  private lastTimestamp: number = -1;

  /**
   * Maximum supported machine ID
   */
  private readonly maxWorkerId: number = ~(-1 << this.workerIdBits);
  /**
   * The maximum supported data identifier ID
   */
  private readonly maxDatacenterId: number = ~(-1 << this.datacenterIdBits);

  /**
   * The machine ID shifts left by 12 bits.
   */
  private readonly workerIdShift: number = this.sequenceBits;
  /**
   * The data identification ID is shifted left by 17 bits (12+5).
   */
  private readonly datacenterIdShift: number = this.sequenceBits + this.workerIdBits;
  /**
   * The time is shifted left by 22 bits (5+5+12)
   */
  private readonly timestampLeftShift: number = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
  /**
   * Generate a mask for the sequence, here it is 4095 (0b111111111111=0xfff=4095)
   */
  private readonly sequenceMask: number = ~(-1 << this.sequenceBits);

  /**
   * Constructor
   * @param options Configuration Item
   * @param {Number} options.workerId Work Node ID
   * @param {Number} options.datacenterId Data Center ID
   * @param {Number} options.epoch default start time: 2025-01-01 00:00:00Z / 1735660800000
   */
  public constructor(options: { workerId?: number; datacenterId?: number; epoch?: number } = {}) {
    const { workerId, datacenterId, epoch } = options;

    if (workerId !== undefined) {
      if (workerId > this.maxWorkerId || workerId < 0) {
        throw new Error(`worker Id can't be greater than ${this.maxWorkerId} or less than 0`);
      }
      this.workerId = workerId;
    }

    if (datacenterId !== undefined) {
      if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
        throw new Error(`datacenter Id can't be greater than ${this.maxDatacenterId} or less than 0`);
      }
      this.datacenterId = datacenterId;
    }

    if (epoch !== undefined) {
      this.epoch = epoch;
    }
  }

  /**
   * Block until the next millisecond,
   * until a new timestamp is obtained.
   * @param {number} lastTimestamp The timestamp of the last generated ID
   * @return Current timestamp
   */
  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = Date.now();
    while (timestamp <= lastTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }

  /**
   * Generate the next ID
   * @return {bigint} 64-bit ID
   */
  public nextId(): bigint {
    let timestamp = Date.now();

    if (timestamp < this.lastTimestamp) {
      throw new Error(`The clock has been set back by ${this.lastTimestamp - timestamp} milliseconds`);
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    return (
      (BigInt(timestamp - this.epoch) << BigInt(this.timestampLeftShift)) |
      (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift)) |
      (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
      BigInt(this.sequence)
    ) & this.MAX_UINT64;
  }

  /**
   * Analyze ID
   * @param {bigint} id 64-bit ID
   * @returns {{ timestamp: number, datacenterId: number, workerId: number, sequence: number }} Analysis results with:
   * - `timestamp`: Milliseconds since epoch
   * - `datacenterId`: Datacenter ID part of the Snowflake ID
   * - `workerId`: Worker node ID part of the Snowflake ID
   * - `sequence`: Sequence number for IDs generated in the same millisecond
   * @example
   * ```ts
   * const uuid = (69715707826409472n).toBigInt();
   * const parsed = snowflake.parseId(uuid);
   * 
   * console.log('Parsed ID:', parsed);
   * // Parsed ID:
   * // {
   * //   "timestamp": 1752282320001,
   * //   "datacenterId": 1,
   * //   "workerId": 1,
   * //   "sequence": 0
   * // }
   * ```
   */
  public parseId(id: bigint): { timestamp: number; datacenterId: number; workerId: number; sequence: number; } {
    return {
      // Extract the timestamp part (shift the high bits to the right)
      timestamp: Number((id >> BigInt(this.timestampLeftShift)) + BigInt(this.epoch)),

      // Data center ID: take a certain middle segment of bits (using right shift + mask)
      datacenterId: Number((id >> BigInt(this.datacenterIdShift)) & BigInt(this.maxDatacenterId)),

      // Work Node ID
      workerId: Number((id >> BigInt(this.workerIdShift)) & BigInt(this.maxWorkerId)),

      // Serial number: directly take the lower 12 bits
      sequence: Number(id & BigInt(this.sequenceMask)),
    };
  }
}