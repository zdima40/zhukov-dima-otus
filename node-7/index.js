import { readFiles } from './files-reader.js';
import { createWriteStream } from 'fs';

try {
    console.log('Please wait...');

    const files = ['file_split_0.txt', 'file_split_1.txt'];
    const readStream = readFiles(files);
    const writableStream = createWriteStream('end_file.txt');
    readStream.pipe(writableStream);

    console.log(`Files has been readed.`);
} catch (error) {
    console.error(error.message);
}
