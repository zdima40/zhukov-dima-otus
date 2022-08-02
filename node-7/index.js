import argsParser from './argv-parser.js';
import { splitFile } from './file-spliter.js';
import { sortFiles } from './stream-sorter.js';

try {
    console.log('Please wait...');
    const args = argsParser(process.argv);
    
    const files = await splitFile(args.path, args.count);
    console.log(`File ${args.path} had been splited on ${args.count} files. Please wait...`);

    await sortFiles(files, args.out);
    console.log(`File had been sorted.`);

} catch (error) {
    console.error(error.message);
}