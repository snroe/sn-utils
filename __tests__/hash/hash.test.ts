import { test, describe, beforeAll, afterAll, expect } from 'bun:test';
import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

// 引入模块
import { hashFile, hashDir, IncrementalHasher } from '../../src/index';

// 异步执行命令
const execAsync = promisify(exec);

// 创建临时目录用于测试
let testDir: string;
let testFilePath: string;
let testTxtPath: string;

describe('Hashing Module Tests', () => {
  beforeAll(async () => {
    testDir = await fs.mkdtemp(path.join(tmpdir(), 'hash-test-'));
    testFilePath = path.join(testDir, 'test.js');
    testTxtPath = path.join(testDir, 'hash-test.txt');

    // 创建一个测试 JS 文件
    await fs.writeFile(testFilePath, 'console.log("Hello World");');
  });

  afterAll(async () => {
    // 清理临时目录
    await fs.remove(testDir);
  });

  test('should compute MD5 hash of a file', async () => {
    const hash = await hashFile(testFilePath, 'md5');
    expect(hash).toBeDefined();
    expect(hash.length).toBe(32); // md5 is 32 chars
  });

  test('should compute SHA-256 hash of a file', async () => {
    const hash = await hashFile(testFilePath, 'sha256');
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // sha256 is 64 chars
  });

  test('should compute hash of a directory', async () => {
    const hash = await hashDir(testDir, { algorithm: 'sha256' });
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // 默认是 SHA-256
  });

  test('should use incremental hasher and cache', async () => {
    const hasher = new IncrementalHasher();
    const hash1 = await hasher.hashDir(testDir);
    const cacheSize1 = hasher.getCacheSize();

    expect(hash1).toBeDefined();
    expect(cacheSize1).toBeGreaterThan(0);
    // expect(hash1).toBeDefined();
    // expect(cacheSize1).toBe(1);

    // 修改目录内容
    await fs.writeFile(testTxtPath, 'new content');
    await new Promise(resolve => setTimeout(resolve, 100));

    const hash2 = await hasher.hashDir(testDir);
    const cacheSize2 = hasher.getCacheSize();

    expect(hash2).toBeDefined();
    expect(hash2).not.toBe(hash1);
    expect(cacheSize2).toBeGreaterThan(cacheSize1);
  });

  test('should clear cache and re-calculate hash', async () => {
    const hasher = new IncrementalHasher();
    const hash1 = await hasher.hashDir(testDir);

    hasher.clearCache();
    const hash2 = await hasher.hashDir(testDir);

    expect(hash1).toBe(hash2); // 因为没有变化，所以应该一致
    expect(hasher.getCacheSize()).toBeGreaterThan(1);
  });

  test('should handle empty directory', async () => {
    const emptyDir = await fs.mkdtemp(path.join(tmpdir(), 'empty-hash-test-'));
    const hash = await hashDir(emptyDir);
    await fs.rmdir(emptyDir, { recursive: true });

    expect(hash).toBeDefined();
  });

  test('should ignore .DS_Store and other temp files', async () => {
    // 创建一些不相关的临时文件
    await fs.writeFile(path.join(testDir, '.DS_Store'), 'fake data');
    await fs.writeFile(path.join(testDir, '.gitignore'), 'fake data');

    const hash1 = await hashDir(testDir);
    const hash2 = await hashDir(testDir, {
      ignoreDirs: ['.DS_Store', '.gitignore'],
    });

    expect(hash1).toBeDefined();
    expect(hash2).toBeDefined();
    expect(hash1).not.toBe(hash2); // 不同的内容应产生不同的哈希
  });
});