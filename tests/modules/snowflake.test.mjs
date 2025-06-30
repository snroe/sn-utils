import { Snowflake } from '../../lib/index';

const options = {
  workerId: 1,
  datacenterId: 1,
  epoch: 1735660800000
};

// 初始化实例
const snowflake = new Snowflake(options);

// 单个 ID 测试
const id = snowflake.nextId();
console.log('Generated ID:', id.toString());
console.log(`Binary representation length: ${id.toString(2).length} bits`);
const parsed = snowflake.parseId(id);
console.log('Parsed Result:', parsed);

// 性能测试：批量生成 N 个 ID
const performanceTest = (counts) => {
  console.log(`\n开始性能测试：生成 ${counts} 个 ID`);

  const start = process.hrtime.bigint();

  let lastId = null;
  for (let i = 0; i < counts; i++) {
    const id = snowflake.nextId();
    if (lastId !== null && id <= lastId) {
      throw new Error(`ID 不唯一或非递增：${id} <= ${lastId}`);
    }
    lastId = id;
  }

  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;

  console.log(`✅ 完成：共生成 ${counts.toLocaleString()} 个唯一 ID`);
  console.log(`⏱ 耗时：${durationMs.toFixed(2)} ms`);
  console.log(`🚀 平均速度：${(counts / (durationMs / 1000)).toFixed(0)} IDs/秒`);
}

// 批量验证测试：生成、解析、校验字段一致性
const validationTest = (counts) => {
  console.log(`\n开始验证测试：生成并解析 ${counts} 个 ID`);

  for (let i = 0; i < counts; i++) {
    const id = snowflake.nextId();
    const parsed = snowflake.parseId(id);

    // 验证关键字段是否合理
    if (parsed.workerId !== options.workerId || parsed.datacenterId !== options.datacenterId) {
      throw new Error(`解析失败，workerId 或 datacenterId 错误：${JSON.stringify(parsed)}`);
    }

    if (parsed.timestamp < Date.now() - 1000 || parsed.timestamp > Date.now() + 1000) {
      throw new Error(`时间戳异常：${parsed.timestamp}`);
    }
  }

  console.log(`✅ 成功通过 ${counts} 次解析验证`);
}

// 吞吐量测试
const throughputTest = (durationMs) => {
  console.log(`\n开始吞吐量测试：持续 ${durationMs} 毫秒`);

  const start = process.hrtime.bigint();
  let count = 0;
  let lastId = null;

  const startTime = Date.now();

  while (Date.now() - startTime < durationMs) {
    const id = snowflake.nextId();
    if (lastId !== null && id <= lastId) {
      throw new Error(`ID 不唯一或非递增：${id} <= ${lastId}`);
    }
    lastId = id;
    count++;
  }

  const end = process.hrtime.bigint();
  const actualDurationMs = Number(end - start) / 1e6;

  console.log(`✅ 完成：共生成 ${count.toLocaleString()} 个唯一 ID`);
  console.log(`⏱ 实际耗时：${actualDurationMs.toFixed(2)} ms`);
  console.log(`🚀 平均速度：${(count / (actualDurationMs / 1000)).toFixed(0)} IDs/秒`);
}


// 运行测试
const counts = 100000;
validationTest(counts); // 基础验证测试
performanceTest(counts); // 性能测试
throughputTest(2500);