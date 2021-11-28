"use strict";

const path = require("path");

const { getAssets } = require("../main/getAssets.js");
const { exportNFTDir } = require("../main/setupWorkspace.js");

const getNameFromPath = (path) => {
    let name = path.split('\\')[path.split('\\').length - 1];
    name = name.split('#')[name.split('#').length - 2];
    return name;
}

const formatAssets = (rawAssets) => {
    let rarityTemplate = {};
    let assetPaths = {};
    rawAssets.forEach((traitTypeObject) => {
        let rarityValueObject = {};
        const traitType = Object.keys(traitTypeObject)[0];
        const traitValues = traitTypeObject[traitType];
        traitValues.forEach((traitValue) => {
            const traitName = getNameFromPath(traitValue);
            rarityValueObject[traitName] = 0;
            assetPaths[`${traitType}-${traitName}`] = traitValue;
        })
        rarityTemplate[traitType] = rarityValueObject;
    })
    rarityTemplate['paths'] = assetPaths;
    return rarityTemplate;
}

const checkDataIntegrity = (populatedData, nftNumber) => {
    let goodData = true;
    Object.keys(populatedData).forEach((layer) => {
        let totalRarity = 0;
        Object.keys(populatedData[layer]).forEach((element) => {
            totalRarity += populatedData[layer][element];
        })
        if (nftNumber !== totalRarity) {
            goodData = false;
            console.error('Data integrity compromised on layer: ', layer, 'found', totalRarity, '/', nftNumber)
        }
    })
    console.log('Data integrity check good? : ', goodData);
}

const populateData = (rarityTemplate) => {
    const metadata = require(path.join(exportNFTDir, '_metadata.json'))
    const traitTypes = Object.keys(rarityTemplate)
    const paths = rarityTemplate.paths;
    let populatedData = {};
    metadata.forEach((metadataFile) => {
        const attributes = metadataFile.attributes;
        attributes.forEach((attribute, traitTypeIndex) => {
            const allTraitTypeAssets = rarityTemplate[traitTypes[traitTypeIndex]];
            const allTraitTypeAssetNames = Object.keys(rarityTemplate[traitTypes[traitTypeIndex]]);
            allTraitTypeAssetNames.forEach((traitValue) => {
                if (traitValue === attribute.value) {
                    const occurence = allTraitTypeAssets[attribute.value] + 1;
                    allTraitTypeAssets[attribute.value] = occurence;
                }
            })
            populatedData[traitTypes[traitTypeIndex]] = allTraitTypeAssets;
        })
    })
    checkDataIntegrity(populatedData, metadata.length)
    populatedData['paths'] = paths;
    populatedData['nftNumber'] = metadata.length;
    return populatedData;
}

const getRarityData = () => {
    const rarityTemplate = formatAssets(getAssets())
    const pupulatedData = populateData(rarityTemplate);
    return pupulatedData;
}

module.exports = {
    getRarityData
}
