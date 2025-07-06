import path from 'path';
import fs from 'fs-extra';
import { hashFile, hashDir, IncrementalHasher } from '../../../lib/index.js';

const libPath = path.join(process.cwd(), 'lib');
const testFilePath = path.join(libPath, 'modules', 'hash', 'hashFile.js');
const testTxtPath = path.join(libPath, 'hash-test.txt');

try {
  // 测试单个文件哈希
  const fileHash = await hashFile(testFilePath, "md5");
  console.log('文件哈希:', fileHash);

  // 测试整个目录哈希
  const dirHash = await hashDir(libPath);
  console.log('目录哈希:', dirHash);

  // 使用增量哈希器
  const hasher = new IncrementalHasher();
  const hash1 = await hasher.hashDir(libPath);
  console.log('增量哈希:', hash1);
  console.log('缓存大小:', hasher.getCacheSize());

  // 创建并写入测试文件
  await fs.ensureFile(testTxtPath);
  await fs.writeFile(testTxtPath, 'test');
  console.log('已创建测试文件 hash-test.txt');

  // 清除缓存后重新计算
  hasher.clearCache();
  const hash2 = await hasher.hashDir(libPath);

  console.log('重算哈希:', hash2);
  console.log('新缓存大小:', hasher.getCacheSize());
} catch (error) {
  throw error;
}