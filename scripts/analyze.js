'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('out.json');
let data = JSON.parse(rawdata);
console.log(`${data.rawTxs.length} txns in bundle`);
let hashCounts = new Map();
data.rawTxs.forEach((val, idx, arr) => {
    const former = arr.slice(0,idx);
    const latter = arr.slice(idx+1, arr.length);
    const temp = [...former, ...latter];
    const existingHash = hashCounts.get(val);
    const numHashes = existingHash || 0;
    const includes = temp.includes(arr[idx]);
    hashCounts.set(val, numHashes + (includes ? 1 : 0));
});
if ( [...hashCounts.keys()].map(key => (hashCounts.get(key) > 1)).includes(true) ) {
    console.log("Duplicate transactions found");
    [...hashCounts.keys()].forEach(key => {
        console.log(`[${key.slice(0, 6)}...${key.slice(-6)}]: ${hashCounts.get(key)} copies`)
    })
} else if ([...hashCounts.keys()].length > 0) {
    console.log("Transactions are unique");
}
