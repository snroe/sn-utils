import fs from 'fs-extra';
import { join, extname, basename } from 'path';
import os from 'os';
import { exec } from 'child_process';

const rootDir = process.cwd();
const testsDir = join(rootDir, '__tests__/modules');

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

/**
 * 递归获取所有 .test.mjs 测试文件路径
 */
async function getAllTestFiles(dir) {
  const files = await fs.readdir(dir);
  let testFiles = [];

  for (const file of files) {
    const fullPath = join(dir, file);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      const nestedTests = await getAllTestFiles(fullPath); // 递归进入子目录
      testFiles = testFiles.concat(nestedTests);
    } else if (extname(file) === '.mjs' && file.endsWith('.test.mjs')) {
      testFiles.push(fullPath);
    }
  }

  return testFiles;
}

/**
 * 串行运行测试
 */
async function runTestsSequentially(testFiles) {
  for (let i = 0; i < testFiles.length; i++) {
    const testFile = testFiles[i];
    const command = `node ${testFile}`;

    console.log(`正在执行：${command}`);

    try {
      const stdout = await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            return reject({ error, stderr });
          }
          if (stderr) {
            console.warn(`⚠️ stderr: ${stderr}`);
          }
          resolve(stdout);
        });
      });

      console.log(`✅ stdout: ${stdout}`);
    } catch (e) {
      console.error(`❌ 测试失败：${basename(testFile)}`);
      console.error(`错误信息：${e.error.message}`);
      if (e.stderr) {
        console.error(`详细错误：${e.stderr}`);
      }
    }
  }
}

// 启动脚本
(async () => {
  const testFiles = await getAllTestFiles(testsDir);
  if (testFiles.length === 0) {
    console.warn('⚠️ 未找到任何测试文件');
    return;
  }

  console.log(`\n🔍 共找到 ${testFiles.length} 个测试文件`);
  await runTestsSequentially(testFiles);
})();