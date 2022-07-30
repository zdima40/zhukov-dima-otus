/**
 *  Создет файл с рандомными числами
 * 
 *  Пример создания файла file.txt размером 100Mb
 *  npm run create-file -- -path 'file.txt' -size 100
 */
import { randomInt } from 'crypto';
import { createWriteStream, existsSync } from 'fs';
import esMain from 'es-main';
import parseArgs from './argv-parser.js';

async function createFileWithRandomNumbers(filePath, mbSize = 1, maxRandomNumber = 255, callback = () => {}) {
    let fileSizeSum = 0;

    if (existsSync(filePath)) {
        throw new Error('File already exists!');
    }

    const writableStream = createWriteStream(filePath);
    writableStream.on('error', error => {
        console.log(`An error writing to the file. Error: ${error.message}`);
    });

    const bSize = mbSize * 1024 * 1024;
    writeNumbers(writableStream, bSize);

    function writeNumbers(writableStream, bSize) {
        let isWrite = true;
        const encoding = 'utf-8';
    
        do {
            const number = randomInt(maxRandomNumber);
            const stringNumber = String(number);
            const numberBytes = Buffer.byteLength(stringNumber, encoding);
            fileSizeSum += numberBytes;

            if (fileSizeSum >= bSize) {                
                isWrite = writableStream.write(stringNumber, encoding, callback);
            } else {
                isWrite = writableStream.write(stringNumber, encoding);
            }
        }
        while (fileSizeSum < bSize && isWrite)
    
        if (fileSizeSum < bSize) {
            writableStream.once('drain', () => writeNumbers(writableStream, bSize));
        } else {
            writableStream.end();
        }
    }
}

if (esMain(import.meta)) {
    try {
        const args = parseArgs(process.argv);
        console.log('File is creating please wait...');
        await createFileWithRandomNumbers(
            args.path,
            args.size,
            args.max,
            () => console.log(`File with name ${args.path} and ${args.size}Mb size was created.`)
        );
    } catch (error) {
        console.error(error.message);
    }
}
