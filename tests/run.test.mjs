import fs from 'fs-extra';
import { join } from 'path';
import os from 'os';
import { exec } from 'child_process';

const rootDir = process.cwd();
const testsDir = join(rootDir, 'tests/modules');

// 获取所有测试文件，并排除 run.mjs
const testsList = fs.readdirSync(testsDir).filter((test) => test !== "run.test.ts");

// 获取系统基本信息
const systemInfo = {
  "操作系统": os.type(),
  "操作系统版本": os.version(),
  "CPU架构": os.arch(),
  "CPU核心数": os.cpus().length,
  "内存总量（以MB为单位）": Math.round(os.totalmem() / (1024 * 1024)),
  "空闲内存（以MB为单位）": Math.round(os.freemem() / (1024 * 1024)),
  "主机名": os.hostname(),
  "平台": os.platform(),
};

console.log("系统基础信息：");
console.log(systemInfo);

async function runTestsSequentially(tests, index = 0) {
  if (index >= tests.length) return;

  const test = tests[index];
  const command = `bun ${join(testsDir, test)}`;

  console.log(`正在执行：${command}`);

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ 测试失败：${test}`);
        console.error(`错误信息：${error.message}`);
      }

      if (stderr) {
        console.warn(`⚠️ stderr: ${stderr}`);
      }

      if (stdout) {
        console.log(`✅ stdout: ${stdout}`);
      }

      resolve();
    });
  }).then(() => runTestsSequentially(tests, index + 1));
}

// 调用串行执行
runTestsSequentially(testsList);

