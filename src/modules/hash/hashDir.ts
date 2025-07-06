import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'node:crypto';
import { hashFile } from './hashFile.js';

/**
 * 递归计算整个目录的哈希
 * @param dirPath 目录路径
 * @returns 目录的哈希
 */
export const hashDir = async (
  dirPath: string,
  options: {
    ext?: string[];          // 可选：指定需要包含的扩展名（白名单）
    ignoreDirs?: string[];   // 可选：忽略的目录
    ignoreFiles?: RegExp;    // 可选：忽略的文件名正则表达式
    algorithm?: string;      // 可选：使用的哈希算法，默认 md5
  } = Object.freeze({})
): Promise<string> => {
  const {
    ext = [],
    ignoreDirs = ['node_modules', '.git'],
    ignoreFiles,
    algorithm = 'md5'
  } = options;

  const ignoredDirsSet = new Set(ignoreDirs.map(d => d.toLowerCase()));
  const allowedExts = new Set(ext.map(e => e.toLowerCase()));

  let files: string[];
  try {
    files = await fs.readdir(dirPath);
  } catch (error) {
    throw new Error(`Failed to read directory "${dirPath}": ${error}`);
  }

  const promises = files.map(async (file) => {
    if (ignoreFiles && ignoreFiles.test(file)) {
      return null;
    }

    const fullPath = path.join(dirPath, file);
    let stat;
    try {
      stat = await fs.stat(fullPath);
    } catch (error) {
      console.warn(`Skipped unreadable file/dir "${fullPath}": ${error}`);
      return null;
    }

    if (ignoredDirsSet.has(file.toLowerCase())) {
      return null;
    }

    if (stat.isDirectory()) {
      return { key: file, value: await hashDir(fullPath, options) };
    } else if (stat.isFile()) {
      const extName = path.extname(file).toLowerCase();
      if (allowedExts.size === 0 || allowedExts.has(extName)) {
        return { key: file, value: await hashFile(fullPath, algorithm) };
      }
    }

    return null;
  });

  const results = await Promise.all(promises);
  const hashes = results
    .filter((r): r is { key: string; value: string } => r !== null)
    .reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

  const sortedKeys = Object.keys(hashes).sort();
  let combinedHash;
  try {
    combinedHash = createHash(algorithm);
  } catch (e) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }

  for (const key of sortedKeys) {
    combinedHash!.update(`${key}:${hashes[key]}`);
  }

  return combinedHash!.digest('hex');
};