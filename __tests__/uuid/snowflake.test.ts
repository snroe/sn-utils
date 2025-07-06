import { describe, beforeAll, test, expect } from 'bun:test';
import { Snowflake } from '../../src/index';

const options = {
  workerId: 1,
  datacenterId: 1,
  epoch: 1735660800000,
};

describe('Snowflake ID Generator', () => {
  let snowflake: Snowflake;

  beforeAll(() => {
    snowflake = new Snowflake(options);
  });

  // 单个 ID 测试：生成 & 解析
  test('should generate and parse a valid ID', () => {
    const id = snowflake.nextId();
    const parsed = snowflake.parseId(id);

    expect(parsed.workerId).toBe(options.workerId);
    expect(parsed.datacenterId).toBe(options.datacenterId);
    expect(parsed.timestamp).toBeGreaterThanOrEqual(Date.now() - 1000);
    expect(parsed.timestamp).toBeLessThanOrEqual(Date.now() + 1000);
  });

  // 唯一性和递增性测试
  test('IDs should be unique and monotonically increasing', () => {
    let lastId: bigint | null = null;
    for (let i = 0; i < 10000; i++) {
      const id = snowflake.nextId();
      if (lastId !== null) {
        expect(id > lastId).toBe(true);
      }
      lastId = id;
    }
  });

  // 批量解析一致性测试
  test('parsed fields should match original config', () => {
    for (let i = 0; i < 1000; i++) {
      const id = snowflake.nextId();
      const parsed = snowflake.parseId(id);

      expect(parsed.workerId).toBe(options.workerId);
      expect(parsed.datacenterId).toBe(options.datacenterId);
      expect(parsed.timestamp).toBeGreaterThanOrEqual(Date.now() - 1000);
      expect(parsed.timestamp).toBeLessThanOrEqual(Date.now() + 1000);
    }
  });

  // 性能测试（开发环境运行）
  test.skipIf(process.env.SKIP_PERF_TESTS === 'true')('performance: generate 100,000 IDs', async () => {
    const counts = 100_000;
    const start = performance.now();

    let lastId: bigint | null = null;
    for (let i = 0; i < counts; i++) {
      const id = snowflake.nextId();
      if (lastId !== null && id <= lastId) {
        throw new Error(`ID 不唯一或非递增：${id} <= ${lastId}`);
      }
      lastId = id;
    }

    const durationMs = performance.now() - start;
    const speed = Math.round(counts / (durationMs / 1000));
    console.log(`✅ Generated ${counts.toLocaleString()} IDs in ${durationMs.toFixed(2)}ms`);
    console.log(`🚀 Speed: ${speed.toLocaleString()} IDs/sec`);
  });

  // 吞吐量测试（持续时间）
  test.skipIf(process.env.SKIP_PERF_TESTS === 'true')('throughput: generate IDs for 2.5s', async () => {
    const durationMs = 2500;
    let count = 0;
    let lastId: bigint | null = null;
    const startTime = Date.now();

    while (Date.now() - startTime < durationMs) {
      const id = snowflake.nextId();
      if (lastId !== null && id <= lastId) {
        throw new Error(`ID 不唯一或非递增：${id} <= ${lastId}`);
      }
      lastId = id;
      count++;
    }

    const actualDurationMs = Date.now() - startTime;
    const speed = Math.round(count / (actualDurationMs / 1000));
    console.log(`✅ Generated ${count.toLocaleString()} IDs in ${actualDurationMs}ms`);
    console.log(`🚀 Average speed: ${speed.toLocaleString()} IDs/sec`);
  });
});