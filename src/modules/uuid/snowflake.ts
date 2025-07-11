/**
 * Twitter的分布式自增ID雪花算法，默认开始时间：2025-01-01 00:00:00
 * @class Snowflake
 * @example
 * ```ts
 * const sf = new Snowflake({workId: 1, datacenterId: 1, epoch: 1735660800000})
 * const id = sf.nextId()
 * console.log('Generated ID:', id.toString());
 * const parsed = sf.parseId(id);
 * console.log('Parsed ID:', parsed);
 * ```
 *
 * @see https://github.com/twitter-archive/snowflake

 */
export class Snowflake {
  private readonly totalBits: BigInt = BigInt(64);
  private readonly MAX_UINT64 = 0xFFFFFFFFFFFFFFFFn;
  /**
   * 机器id所占的位数
   */
  private readonly workerIdBits: number = 5;
  /**
   * 数据标识id所占的位数
   */
  private readonly datacenterIdBits: number = 5;
  /**
   * 序列在id中占的位数
   */
  private readonly sequenceBits: number = 12;

  /**
   * 开始时间截 (2025-01-01 00:00:00)
   */
  private epoch: number = 1735660800000;
  /**
   * 工作机器ID(0~31)
   */
  private workerId: number = 1;
  /**
   * 数据中心ID(0~31)
   */
  private datacenterId: number = 1;
  /**
   * 毫秒内序列(0~4095)
   */
  private sequence: number = 0;
  /**
   * 上次生成ID的时间截
   */
  private lastTimestamp: number = -1;

  /**
   * 支持的最大机器id
   */
  private readonly maxWorkerId: number = ~(-1 << this.workerIdBits);
  /**
   * 支持的最大数据标识id
   */
  private readonly maxDatacenterId: number = ~(-1 << this.datacenterIdBits);

  /**
   * 机器ID向左移12位
   */
  private readonly workerIdShift: number = this.sequenceBits;
  /**
   * 数据标识id向左移17位(12+5)
   */
  private readonly datacenterIdShift: number = this.sequenceBits + this.workerIdBits;
  /**
   * 时间截向左移22位(5+5+12)
   */
  private readonly timestampLeftShift: number = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
  /**
   * 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)
   */
  private readonly sequenceMask: number = ~(-1 << this.sequenceBits);

  /**
   * 构造函数
   * @param options 配置项
   * @param {Number} options.workerId 工作节点ID
   * @param {Number} options.datacenterId 数据中心ID
   * @param {Number} options.epoch 开始时间截，默认为 2025-01-01 00:00:00
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
   * 阻塞到下一个毫秒，直到获得新的时间戳
   * @param lastTimestamp 上次生成ID的时间截
   * @return 当前时间戳
   */
  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = Date.now();
    while (timestamp <= lastTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }

  /**
   * 生成下一个ID
   * @return 64位ID
   */
  public nextId(): bigint {
    let timestamp = Date.now();

    if (timestamp < this.lastTimestamp) {
      throw new Error(`时钟回退了 ${this.lastTimestamp - timestamp} 毫秒`);
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
   * 解析ID
   * @param id 64位ID
   * @returns 解析结果
   */
  public parseId(id: bigint): { timestamp: number; datacenterId: number; workerId: number; sequence: number; } {
    return {
      // 取出时间戳部分（高位向右移）
      timestamp: Number((id >> BigInt(this.timestampLeftShift)) + BigInt(this.epoch)),

      // 数据中心ID：取中间某段bit（用右移 + 掩码）
      datacenterId: Number((id >> BigInt(this.datacenterIdShift)) & BigInt(this.maxDatacenterId)),

      // 工作节点ID
      workerId: Number((id >> BigInt(this.workerIdShift)) & BigInt(this.maxWorkerId)),

      // 序列号：直接取低12位
      sequence: Number(id & BigInt(this.sequenceMask)),
    };
  }
}