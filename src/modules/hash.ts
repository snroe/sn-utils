import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'node:crypto';

/**
 * 计算单个文件的哈希
 * @param filePath 文件路径
 * @returns 文件的哈希值
 */
export const hashFile = async (filePath: string): Promise<string> => {
  const hash = createHash('md5');
  const stream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * 递归计算整个目录的哈希
 * @param dirPath 目录路径
 * @returns 目录的哈希
 */
export const hashDirectory = async (dirPath: string): Promise<string> => {
  const files = await fs.readdir(dirPath);
  const hashes: Record<string, string> = {};

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      hashes[file] = await hashDirectory(fullPath);
    } else if (/\.(ts|js)$/i.test(file)) {
      hashes[file] = await hashFile(fullPath);
    }
  }

  // 对子哈希进行排序合并成总哈希
  const sortedKeys = Object.keys(hashes).sort();
  const combinedHash = createHash('md5');

  for (const key of sortedKeys) {
    combinedHash.update(`${key}:${hashes[key]}`);
  }

  return combinedHash.digest('hex');
}