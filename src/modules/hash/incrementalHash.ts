import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'node:crypto';
import { hashFile } from './hashFile.js';

// 类型定义
export type DirHashCache = Map<string, string>; // 路径 => 哈希
export type MTimeCache = Map<string, number>;  // 路径 => 修改时间戳
export type ContentHashCache = Map<string, string>; // 路径 => 内容哈希

/**
 * 增量哈希计算
 * 适用于目录结构不变，文件内容有变更的场景
 */
export class IncrementalHasher {
  private cache: DirHashCache;
  private mtimeCache: MTimeCache;
  private contentHashCache: ContentHashCache;

  constructor() {
    this.cache = new Map();
    this.mtimeCache = new Map();
    this.contentHashCache = new Map();
  }

  /**
   * 增量计算目录哈希（仅重新计算变更部分）
   * @param dirPath 目录路径
   * @param options 配置项
   * @param options.ext 白名单扩展名
   * @param options.ignoreDirs 忽略的目录
   * @param options.ignoreFiles 忽略的文件正则表达式
   * @param options.algorithm 哈希算法，默认 md5
   * @returns 目录哈希
   */
  public async hashDir(
    dirPath: string,
    options: {
      ext?: string[];
      ignoreDirs?: string[];
      ignoreFiles?: RegExp;
      algorithm?: string; 
    } = {}
  ): Promise<string> {
    const resolvedOptions = {
      ext: options.ext || [],
      ignoreDirs: options.ignoreDirs || ['node_modules', '.git'],
      ignoreFiles: options.ignoreFiles,
      algorithm: options.algorithm || 'md5'
    };

    return this._hashDir(dirPath, resolvedOptions);
  }

  /**
   * 增量哈希
   * @param dirPath 目录路径
   * @param options 选项
   * @param options.ext 白名单扩展名
   * @param options.ignoreDirs 忽略的目录
   * @param options.ignoreFiles 忽略的文件正则表达式
   * @param options.algorithm 哈希算法，默认 md5
   * @returns {Promise<string>}
   */
  private async _hashDir(
    dirPath: string,
    options: {
      ext: string[];
      ignoreDirs: string[];
      ignoreFiles?: RegExp;
      algorithm: string;
    },
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

    this.cache.delete(currentKey);

    const hashes: Record<string, string> = {};
    const newMTimeCache = new Map(this.mtimeCache); // 防止污染原缓存

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

      const newContentHash = await hashFile(fullPath, 'sha1');

      // 如果未变化，使用缓存
      if (
        cachedMTimeMs === currentMTimeMs &&
        this.contentHashCache.get(resolvedPath) === newContentHash &&
        this.cache.has(resolvedPath)
      ) {
        hashes[file] = this.cache.get(resolvedPath)!;
        continue;
      }

      // 否则重新计算
      if (isDirectory) {
        const subHash = await this._hashDir(fullPath, options);
        hashes[file] = subHash;
        this.cache.set(resolvedPath, subHash);
      } else if (stat.isFile()) {
        const extName = path.extname(file).toLowerCase();

        if (allowedExts.size === 0 || allowedExts.has(extName)) {
          const fileHash = await hashFile(fullPath, algorithm);
          hashes[file] = fileHash;
          this.cache.set(resolvedPath, fileHash);
        }
      }

      newMTimeCache.set(resolvedPath, currentMTimeMs);
      this.contentHashCache.set(resolvedPath, newContentHash); 
    }

    // 排序并生成总哈希
    const sortedKeys = Object.keys(hashes).sort();
    const combinedHash = createHash(algorithm);

    for (const key of sortedKeys) {
      combinedHash.update(`${key}:${hashes[key]}`);
    }

    const finalHash = combinedHash.digest('hex');
    this.cache.set(currentKey, finalHash); 
    this.mtimeCache = newMTimeCache; // 更新全局 mtime 缓存

    return finalHash;
  }

  /**
   * 清除当前缓存（用于强制重新计算）
   */
  public clearCache(): void {
    this.cache.clear();
    this.mtimeCache.clear();
    this.contentHashCache.clear();
  }

  /**
   * 获取当前缓存大小（调试用）
   * @returns 缓存大小
   */
  public getCacheSize(): number {
    return this.cache.size;
  }
}