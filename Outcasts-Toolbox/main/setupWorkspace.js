"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");

///////////////////////////////////////////////////////////////////////////////////////////

const { exportPath } = require(`${basePath}/setup/config.json`);
const genesisPath = exportPath === 'default' ? basePath : exportPath;

const exportDir = path.join(genesisPath, "exported");
const exportNFTDir = path.join(genesisPath, "exported/NFTs");
const exportUtilityDir = path.join(genesisPath, "exported/Utils");
const assetsDir = path.join(basePath, "setup/assets");
const configFile = path.join(basePath, 'setup/config.json');

///////////////////////////////////////////////////////////////////////////////////////////

const initiateGenesisFolders = () => {
    if (fs.existsSync(exportDir)) {
        fs.rmSync(exportDir, { recursive: true });
        fs.mkdirSync(exportDir);
        fs.mkdirSync(exportUtilityDir);
        fs.mkdirSync(exportNFTDir);
    } else {
        fs.mkdirSync(exportDir);
        fs.mkdirSync(exportUtilityDir);
        fs.mkdirSync(exportNFTDir);
    }
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);
}

module.exports = {
    initiateGenesisFolders,
    exportUtilityDir,
    exportNFTDir,
    configFile,
    exportDir,
    assetsDir
};

