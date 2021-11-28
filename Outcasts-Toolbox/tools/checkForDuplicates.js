"use strict";

const fs = require("fs");
const path = require("path");
const { exportNFTDir } = require("../main/setupWorkspace");

const rawdata = fs.readFileSync(path.join(exportNFTDir, '_metadata.json'));
const metadataList = JSON.parse(rawdata);

console.log(`Verifying metadata: ${exportNFTDir}/_metadata.json`);

function arraysEqual(a1, a2, keyofa1, keyofa2) {

    let count = 0;
    a1.forEach((element, key) => {
        if (element.value === a2[key].value) count++;
    })
    if (count > 6 && keyofa1.edition !== keyofa2.edition) {
        console.log('Found duplicate: ', keyofa1.edition, keyofa2.edition);
        return true;
    }
    return false;
}

let foundDuplicate = false;
let duplicateCount = 0;
let checkCount = 0;

console.log('Checking for duplicates...');

metadataList.forEach((element) => {
    const attributesToVerify = element.attributes;
    metadataList.forEach((comparableSet) => {
        checkCount++;
        if (arraysEqual(attributesToVerify, comparableSet.attributes, element, comparableSet)) {
            foundDuplicate = true;
            duplicateCount++;
        }
    });
});

console.log('Has Duplicate been found: ', foundDuplicate, 'checked: ', checkCount, 'times.')

console.log('Press any key to exit...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));