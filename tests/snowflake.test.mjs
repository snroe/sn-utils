import { Snowflake } from '../lib/index.js';

const options = {
  workerId: 31,
  datacenterId: 31
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
function performanceTest() {
  console.log(`\n开始性能测试：生成 ${count} 个 ID`);

  const start = process.hrtime.bigint();

  let lastId = null;
  for (let i = 0; i < count; i++) {
    const id = snowflake.nextId();
    if (lastId !== null && id <= lastId) {
      throw new Error(`ID 不唯一或非递增：${id} <= ${lastId}`);
    }
    lastId = id;
  }

  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;

  console.log(`✅ 完成：共生成 ${count.toLocaleString()} 个唯一 ID`);
  console.log(`⏱ 耗时：${durationMs.toFixed(2)} ms`);
  console.log(`🚀 平均速度：${(count / (durationMs / 1000)).toFixed(0)} IDs/秒`);
}

// 批量验证测试：生成、解析、校验字段一致性
function validationTest() {
  console.log(`\n开始验证测试：生成并解析 ${count} 个 ID`);

  for (let i = 0; i < count; i++) {
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

  console.log(`✅ 成功通过 ${count} 次解析验证`);
}

const count = 1000000;
// 运行测试
validationTest();         // 基础验证测试
performanceTest();   // 性能测试