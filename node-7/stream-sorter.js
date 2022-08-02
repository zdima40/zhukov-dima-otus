import readline from 'readline';
import { createWriteStream, createReadStream } from 'fs';

let isWrite = true;

export async function sortFiles(files, outFileName = 'out_file.txt') {
    return new Promise(async resolve => {
        const rls = files.map(file => {
            const fileStream = createReadStream(file);
            const rl = readline.createInterface({
                input: fileStream,
                crldDelay: Infinity
            });
            return rl[Symbol.asyncIterator]();
        });
    
        const writableStream = createWriteStream(outFileName);
    
        const results = await Promise.all(rls.map(async rl => await rl.next()));
        const numbers = results.map(res => Number(res.value));
        let indexMinNumber = writeMinNumber(writableStream, numbers);
        numbers.splice(indexMinNumber, 1);
    
        let dones = [];
        let doneAll = false;
    
        await write();
        
        async function write() {
            isWrite = true;
            while (!doneAll && isWrite) {
                if (!dones[indexMinNumber]) {
                    let data = await rls[indexMinNumber].next();
                    dones[indexMinNumber] = data.done;
                    if (!data.done) {
                        numbers.splice(indexMinNumber, 0, Number(data.value));
                        indexMinNumber = writeMinNumber(writableStream, numbers);
                        numbers.splice(indexMinNumber, 1);
                    }
                } else {
                    const doneCount = dones.filter(done => done === true);
                    if (doneCount.length === rls.length) {
                        doneAll = true;
                    } else {
                        indexMinNumber = (indexMinNumber + 1) % rls.length;
                    }
                }
            }
    
            if (!doneAll) {
                writableStream.once('drain', () => write());
            } else {
                writableStream.end();
                resolve();
            }
       }
    });
}

function writeMinNumber(writableStream, numbers) {
    let minNumber = Math.min(...numbers);
    let indexMinNumber = numbers.findIndex(number => number === minNumber);

    if (indexMinNumber === -1) {
        console.log(numbers, minNumber);
    }
    
    isWrite = writableStream.write(`${minNumber},`);
    return indexMinNumber;
}
