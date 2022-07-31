import { createReadStream } from 'fs';
import { Readable } from 'stream';

export function readFiles(files) {
    const mainReadStream = new Readable();
    mainReadStream._read = () => {};
    let i = 0;

    const readStreams = files.map(file => {
        const readStream = createReadStream(file);
        readStream.pause();

        readStream.on('data', (chunk) => {
            readStream.pause();
            mainReadStream.push(chunk);
            const nextIndex = (i + 1) % readStreams.length;
            readStreams[nextIndex].resume();
            i++;
        });

        return readStream;
    });

    readStreams[0].resume();

    return mainReadStream;
}
