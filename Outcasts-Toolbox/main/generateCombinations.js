"use strict";

const fs = require("fs");
let sha1 = require('sha-1');


const { printNFT } = require("./printNFT.js");
const { getAssets } = require("./getAssets.js");

const { configFile, exportNFTDir } = require("./setupWorkspace.js");
const { assetsOrder, numberOfNFTs, uniquePieces } = require(configFile);

let dnaList = [];
let _metadata = [];

/////////////////////////////////////////////////////////////////////////////////////////

function arraysEqual(a1, a2, keyofa1, keyofa2) {
    let count = 0;
    a1.forEach((element, key) => {
        if (element.value === a2[key].value) count++;
    })
    if (count > assetsOrder - 1 && keyofa1 !== keyofa2) {
        console.log('Found duplicate: ', keyofa1, keyofa2)
        return true;
    }
    return false;
}

/////////////////////////////////////////////////////////////////////////////////////////

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const getName = (path) => {
    let name = path.split('\\')[path.split('\\').length - 1];
    name = name.split('#')[name.split('#').length - 2];
    return name;
}

const getRarity = (path) => {
    let rarity = path.split('\\')[path.split('\\').length - 1];
    rarity = rarity.split('#')[rarity.split('#').length - 1].replaceAll('.png', '');
    return parseFloat(rarity);
}

/////////////////////////////////////////////////////////////////////////////////////////

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

const randomRarity = () => {
    return (getRandomIntInclusive(1, 100) / 10).toFixed(1);
}

const generateAssetData = (data, randomEnabled) => {
    let dataToReturn = [];
    let index = 0;
    data.forEach((traitType, key) => {
        let assets = []
        traitType[assetsOrder[key]].forEach((path) => {
            index++;
            const rarity = !randomEnabled ? getRarity(path) : randomRarity();
            let assetConfig = {
                index,
                path,
                name: getName(path),
                rarity: rarity,
            }
            assets.push(assetConfig)
        });
        dataToReturn.push(assets)
    });
    return dataToReturn;
}

/////////////////////////////////////////////////////////////////////////////////////////

const generateDna = (data, index, uniquePieces) => {
    const rarityIndexCoeficient = 10;
    let finalAttributes = [];
    let paths = [];
    let dna = '';
    if (uniquePieces.filter(piece => piece.index === index).length === 1) {
        const piece = uniquePieces.filter(piece => piece.index === index)[0];
        const layers = Object.keys(piece.attributes);
        data.forEach((layer, key) => {
            const { name, path, index } = layer.filter(atr => atr.name === piece.attributes[layers[key]])[0];
            const selectedAttribute = {
                trait_type: layers[key],
                value: name
            }
            finalAttributes.push(selectedAttribute);
            paths.push(path);
            dna += index;
        })
        console.log('\x1b[33m%s\x1b[0m', `\nGenerated unique piece with DNA: ${sha1(dna)} at index:`, index);
    } else {
        data.forEach((layer, key) => {
            let rarityList = [];
            let totalRarity = 0;
            layer.forEach((asset) => {
                for (let i = 0; i < asset.rarity * rarityIndexCoeficient; i++) {
                    rarityList.push(asset);
                }
                totalRarity += asset.rarity * rarityIndexCoeficient;
            })
            const { name, path, index } = rarityList[getRandomInt(0, totalRarity - 1)];
            const selectedAttribute = {
                trait_type: assetsOrder[key],
                value: name
            }
            finalAttributes.push(selectedAttribute);
            paths.push(path);
            dna += index;
        })
    }
    return { finalAttributes, dna: sha1(dna), paths };
}

/////////////////////////////////////////////////////////////////////////////////////////

const doubleCheckDuplicates = (list) => {
    let foundDuplicate = false;
    let checkCount = 0;
    list.forEach((attributes_, key1) => {
        list.forEach((attributesToCompare, key2) => {
            checkCount++;
            if (arraysEqual(attributes_, attributesToCompare, key1, key2)) {
                foundDuplicate = true;
                duplicateCount++;
            }
        });
    })
    console.log('Has Duplicate been found: ', foundDuplicate, 'checked: ', checkCount, 'times.')
}

/////////////////////////////////////////////////////////////////////////////////////////

function printProgress(index, max, measured_time) {
    const minutes = Math.ceil((measured_time * max - measured_time * (index + 1)) / 60);
    const seconds = Math.floor((measured_time * max - measured_time * (index + 1)) % 60);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
        `Progress: generated --- ${index + 1} / ${max} NFTs --- each NFT taking about ${measured_time}s to render, time remaining: ${minutes} Minutes, ${seconds} Seconds`
    );
}

const generateUniquePieceIndexes = (uniqueNumber, numberOfNFTs) => {
    let uniquePiecesList = [];
    for (let i = 0; i < uniqueNumber; i++) {
        let randomIndex = getRandomInt(0, numberOfNFTs - 1);
        while (uniquePiecesList.filter(piece => piece.index === randomIndex).length !== 0) {
            randomIndex = getRandomInt(0, numberOfNFTs - 1);
        }
        if (uniquePiecesList.filter(piece => piece.index === randomIndex).length === 0) {
            uniquePiecesList.push({ index: randomIndex, attributes: uniquePieces[i]});
        }
    }
    return uniquePiecesList;
}

const generateMetadata = async ({ randomEnabled }) => {
    let generatedData = 0;
    let attributesList = []
    let hasMeasuredTime = false;
    let measuredTime = new Date().getTime();
    let uniqueIndexes = generateUniquePieceIndexes(uniquePieces.length, numberOfNFTs);
    const assetData = generateAssetData(getAssets(), randomEnabled);
    console.log('Generating Attribute Combinations...', 'Random rarity:', randomEnabled ? 'ENABLED': 'DISABLED');
    while (generatedData < numberOfNFTs) {
        const { finalAttributes, dna, paths } = generateDna(assetData, generatedData, uniqueIndexes);
        if (dnaList.filter(dna_ => dna_ === dna).length === 0) {
            dnaList.push(dna);
            attributesList.push(finalAttributes);
            _metadata.push(await printNFT(paths, generatedData, finalAttributes));
            if (generatedData + 1 === numberOfNFTs) fs.writeFileSync(
                `${exportNFTDir}/_metadata.json`,
                JSON.stringify(_metadata, null, 2)
            );
            if (!hasMeasuredTime) {
                measuredTime = new Date().getTime() - measuredTime;
                hasMeasuredTime = true;
            }
            printProgress(generatedData, numberOfNFTs, measuredTime / 1000);
            generatedData++;
        } else {
            console.log('DNA Exists, regenerating...')
            if (uniqueIndexes.filter(piece => piece.index === generatedData).length === 1) {
                let newArray = [];
                uniqueIndexes.forEach((piece) => {
                    if (piece !== uniqueIndexes.filter(piece => piece.index === generatedData)[0]) {
                        newArray.push(piece);
                    }
                })
                uniqueIndexes = newArray;
            }
        }
    }
    console.log('\nGenerated ', attributesList.length, ' attribute combinations. ', 'Double checking for duplicates...');
    doubleCheckDuplicates(attributesList);
}

module.exports = {
    generateMetadata
};