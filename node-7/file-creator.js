/**
 *  Создет файл с рандомными числами
 * 
 *  Пример создания файла file.txt размером 100Mb
 *  npm run create-file -- -path 'file.txt' -size 100
 */
import { randomInt } from 'crypto';
import { createWriteStream, existsSync } from 'fs';
import esMain from 'es-main';
import argsParser from './argv-parser.js';

let fileSizeSum = 0;

async function createFileWithRandomNumbers(filePath, mbSize = 1, maxRandomNumber = 255) {
    if (existsSync(filePath)) {
        throw new Error('File already exists!');
    }

    const writableStream = createWriteStream(filePath);
    writableStream.on('error', error => {
        console.log(`An error writing to the file. Error: ${error.message}`);
    });

    const bSize = mbSize * 1024 * 1024;
    writeNumbers(writableStream, bSize);
}

function writeNumbers(writableStream, bSize) {
    let isWrite = true;

    do {
        const number = generateRandomNumber(255);
        isWrite = writableStream.write(String(number));
    }
    while (fileSizeSum < bSize && isWrite)

    if (fileSizeSum < bSize) {
        fileSizeSum += writableStream.writableLength;
        writableStream.once('drain', () => writeNumbers(writableStream, bSize));
    } else {
        writableStream.end();
    }
}

function generateRandomNumber(max) {
    return randomInt(max);
}

if (esMain(import.meta)) {
    try {
        const args = argsParser(process.argv);
        await createFileWithRandomNumbers(args.path, args.size);
    } catch (error) {
        console.error(error.message);
    }
}
