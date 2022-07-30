export default function (argv) {
    const args = argv.splice(2);
    const resultArgs = { nokey: [] };

    for (let i = 0, j = 1; i < args.length; i += j) {
        if (args[i].startsWith('-')) {
            const key = args[i].slice(1);
            resultArgs[key] = args[i + 1];
            j = 2;
        } else {
            resultArgs.nokey.push(args[i]);
            j = 1;
        }
    }

    return resultArgs;
}
