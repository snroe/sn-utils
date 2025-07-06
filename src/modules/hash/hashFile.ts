import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'node:crypto';

/**
 * 计算单个文件的哈希
 * @param filePath 文件路径
 * @param algorithm 哈希算法
 * @returns 文件的哈希值
 */
export const hashFile = async (
  filePath: string,
  algorithm: string
): Promise<string> => {
  try {
    const hash = createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to hash file "${filePath}": ${error}`);
  }
};