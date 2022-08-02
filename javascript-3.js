const fn1 = () => {
    console.log('fn1');
    return Promise.resolve(1);
}

const fn2 = () => new Promise(resolve => {
    console.log('fn2');
    setTimeout(() => resolve(2), 1000);
})

const reduce = (memo, value) => {
    console.log('reduce');
    return memo * value;
}

const initialValue = 1;

function promiseReduce(asyncFunctions, reduce, initialValue) {
    return new Promise(async resolve => {
        let memo = initialValue;

        for (let asyncFunction of asyncFunctions) {
            const number = await asyncFunction();
            memo = reduce(memo, number);
        }

        return resolve(memo);
    })
}

// "fn1"
// "reduce"
// "fn2"
// "reduce"
// "result" 2
promiseReduce([fn1, fn2], reduce, 1).then(result => console.log('result', result));
