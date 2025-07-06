import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'node:crypto';
import { hashFile } from './hashFile.js';

// 类型定义
type DirHashCache = Map<string, string>; // 路径 => 哈希
type MTimeCache = Map<string, number>;  // 路径 => 修改时间戳

export class IncrementalHasher {
  private cache: DirHashCache;
  private mtimeCache: MTimeCache;

  constructor() {
    this.cache = new Map();
    this.mtimeCache = new Map();
  }

  /**
   * 增量计算目录哈希（仅重新计算变更部分）
   */
  public async hashDir(
    dirPath: string,
    options: {
      ext?: string[];          // 白名单扩展名
      ignoreDirs?: string[];   // 忽略的目录
      ignoreFiles?: RegExp;    // 忽略的文件正则表达式
      algorithm?: string;      // 哈希算法，默认 md5
    } = {}
  ): Promise<string> {
    const resolvedOptions = {
      ext: options.ext || [],
      ignoreDirs: options.ignoreDirs || ['node_modules', '.git'],
      ignoreFiles: options.ignoreFiles,
      algorithm: options.algorithm || 'md5'
    };

    return this._hashDir(dirPath, resolvedOptions, this.cache, this.mtimeCache);
  }

  /**
   * 内部递归实现：增量哈希
   */
  private async _hashDir(
    dirPath: string,
    options: {
      ext: string[];
      ignoreDirs: string[];
      ignoreFiles?: RegExp;
      algorithm: string;
    },
    cache: DirHashCache,
    mtimeCache: MTimeCache
  ): Promise<string> {
    const { ext, ignoreDirs, ignoreFiles, algorithm } = options;
    const ignoredDirsSet = new Set(ignoreDirs.map(d => d.toLowerCase()));
    const allowedExts = new Set(ext.map(e => e.toLowerCase()));

    let files: string[];

    try {
      files = await fs.readdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to read directory "${dirPath}": ${error}`);
    }

    const currentKey = path.resolve(dirPath);
    const hashes: Record<string, string> = {};
    const newMTimeCache = new Map(mtimeCache); // 防止污染原缓存

    for (const file of files) {
      if (ignoreFiles && ignoreFiles.test(file)) continue;

      const fullPath = path.join(dirPath, file);
      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch (error) {
        console.warn(`Skipped unreadable file/dir "${fullPath}": ${error}`);
        continue;
      }

      const resolvedPath = path.resolve(fullPath);
      const isDirectory = stat.isDirectory();

      if (isDirectory && ignoredDirsSet.has(file.toLowerCase())) continue;

      const currentMTimeMs = stat.mtimeMs;
      const cachedMTimeMs = newMTimeCache.get(resolvedPath);

      // 如果未变化，使用缓存
      if (cachedMTimeMs === currentMTimeMs && cache.has(resolvedPath)) {
        hashes[file] = cache.get(resolvedPath)!;
        continue;
      }

      // 否则重新计算
      if (isDirectory) {
        hashes[file] = await this._hashDir(fullPath, options, cache, newMTimeCache);
      } else if (stat.isFile()) {
        const extName = path.extname(file).toLowerCase();
        if (allowedExts.size === 0 || allowedExts.has(extName)) {
          hashes[file] = await hashFile(fullPath, algorithm);
        }
      }

      newMTimeCache.set(resolvedPath, currentMTimeMs);
    }

    // 排序并生成总哈希
    const sortedKeys = Object.keys(hashes).sort();
    const combinedHash = createHash(algorithm);

    for (const key of sortedKeys) {
      combinedHash.update(`${key}:${hashes[key]}`);
    }

    const finalHash = combinedHash.digest('hex');
    cache.set(currentKey, finalHash);
    this.mtimeCache = newMTimeCache; // 更新全局 mtime 缓存

    return finalHash;
  }

  /**
   * 清除当前缓存（用于强制重新计算）
   */
  public clearCache(): void {
    this.cache.clear();
    this.mtimeCache.clear();
  }

  /**
   * 获取当前缓存大小（调试用）
   */
  public getCacheSize(): number {
    return this.cache.size;
  }
}