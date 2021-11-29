const fs = require('fs');
const path = require('path');

const { getRarityData } = require("../main/createRarityData");
const { exportNFTDir } = require("../main/setupWorkspace");

const occurenceThreshhold = 3;
let rareAttributes = [];

let rawMetadata = fs.readFileSync(path.join(exportNFTDir, `_metadata.json`));
let metadata = JSON.parse(rawMetadata);

const printRarestPieces = () => {
    const rarityData = getRarityData();
    Object.keys(rarityData).slice(0, Object.keys(rarityData).length - 2).forEach(layer => {
        const assets = rarityData[layer];
        Object.keys(assets).forEach((asset) => {
            if (assets[asset] > 0 && assets[asset] <= occurenceThreshhold) {
                rareAttributes.push(`${layer}-${asset}`);
            }
        })
    });
    rareAttributes.forEach((rareAttribute) => {
        const attributeLayer = rareAttribute.split('-')[0];
        const attributeValue = rareAttribute.split('-')[1];
        metadata.forEach((item) => {
            const pieceIndex = item.index;
            const pieceAttributes = item.attributes;
            pieceAttributes.forEach(({trait_type, value}) => {
                if (trait_type === attributeLayer && value === attributeValue) {
                    console.log('Found: ', `"${rareAttribute}"`, 'on piece ->', `${pieceIndex}.png`);
                }
            })
        });
    })
}

printRarestPieces();

console.log('\nPress any key to exit...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));