"use strict";

const { initiateGenesisFolders } = require("./main/setupWorkspace");
const { generateMetadata } = require("./main/generateCombinations");

const isRandomRarityEnabled = process.argv[process.argv.length - 1] === '--random-rarity-enabled';

(() => {
    initiateGenesisFolders();
    generateMetadata({ randomEnabled: isRandomRarityEnabled });
})();