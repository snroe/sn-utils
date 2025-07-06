import path from 'path';
import { hashFile, hashDirectory } from '../../lib/index';

// test('hashFile', async () => {
//   const hash = await hashFile('test/fixtures/file.txt');
//   expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
// });

const hash = await hashFile(path.join(process.cwd(), 'src/modules/hash.ts'));
const hashDir = await hashDirectory(path.join(process.cwd(), 'src'));

console.log(hash, hashDir);