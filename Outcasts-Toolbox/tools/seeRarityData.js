const { getRarityData } = require("../main/createRarityData");

(() => {
    console.log(getRarityData());
    console.log('\nPress any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
})();