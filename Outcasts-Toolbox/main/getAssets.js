"use strict";

const path = require("path");
const fs = require("fs");

const { assetsDir, configFile } = require("./setupWorkspace");

/////////////////////////////////////////////////////////////////////////////////////////

function rreaddirSync(dir, allFiles = []) {
    const files = fs.readdirSync(dir).map(f => path.join(dir, f))
    allFiles.push(...files)
    files.forEach(f => {
        fs.statSync(f).isDirectory() && rreaddirSync(f, allFiles)
    })
    return allFiles;
}

/////////////////////////////////////////////////////////////////////////////////////////

const getAssets = () => {
    let assets = [];
    const { assetsOrder } = require(configFile);
    assetsOrder.forEach((traitType) => {
        const traitValuesDir = path.join(assetsDir, traitType);
        assets.push({ [traitType]: rreaddirSync(traitValuesDir) });
    });
    return assets;
}

module.exports = {
    getAssets
};