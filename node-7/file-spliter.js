/**
 *  Разбивает файл на несколько файлов.
 * 
 *  Пример разбиения файла file.txt размером 100Mb на два по 50Mb
 *  npm run split-file -- -path 'file.txt' -count 2
 */

import esMain from 'es-main';
import { createWriteStream, createReadStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import argsParser from './argv-parser.js';
import { stat } from 'fs/promises';
import { Transform } from 'stream';


async function splitFile(readFilePath, newFilesCount) {
    newFilesCount = Number(newFilesCount);
    const fileSize = await getFileSize(readFilePath);

    for (let i = 0; i < newFilesCount; i++) {
        const ranges = getRanges(fileSize, newFilesCount);
        const readOptions = {
            start: ranges[i][0],
            end: ranges[i][1],
            highWaterMark: Math.ceil(fileSize / newFilesCount),
        };
        await writeNewFile(readFilePath, `file_split_${i}.txt`, readOptions);
    }
}

async function getFileSize(filePath) {
    const stats = await stat(filePath);
    return stats.size;
}

function getRanges(sum, count) {
    const val = sum / count;
    return Array
        .from(Array(count).keys())
        .map((_, i) => {
            const n = i === 0 ? 0 : 1;
            return [
                Math.floor(i * val + n),
                Math.floor((i + 1) * val)
            ];
        })
}

async function writeNewFile(readFilePath, writeFilePath, readOptions) {
    if (existsSync(writeFilePath)) {
        throw new Error('File already exists!');
    }

    const readableStream = createReadStream(readFilePath, readOptions);
    const writableStream = createWriteStream(writeFilePath);

    const sortChunkNumbers = new Transform({
        transform(chunk, encoding, callback) {
            const stringNumbers = chunk.toString();
            const sortedChunk = stringNumbers
                .split(',')
                .map(n => Number(n))
                .sort((a, b) => a - b)
                .join(',');
            callback(null, sortedChunk);
        }
    });
    
    return await pipeline(readableStream, sortChunkNumbers, writableStream);
}

if (esMain(import.meta)) {
    try {
        const args = argsParser(process.argv);
        console.log('Please wait...');
        await splitFile(args.path, args.count);
        console.log(`File ${args.path} had been splited on ${args.count} files.`);
    } catch (error) {
        console.error(error.message);
    }
}
