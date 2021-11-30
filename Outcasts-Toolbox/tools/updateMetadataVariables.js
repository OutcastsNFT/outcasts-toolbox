"use strict";

const path = require("path");
const fs = require("fs");
const { exportNFTDir } = require("../main/setupWorkspace");
const updatedVariables = require("../setup/updateMetadataVariables.json");

let rawMetadata = fs.readFileSync(path.join(exportNFTDir, `_metadata.json`));
let metadata = JSON.parse(rawMetadata);

function printProgress(index, max) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(
      `Progress: updated --- ${index + 1} / ${max} NFTs`
  );
}

metadata.forEach((item) => {
  const numberOfNFTs = metadata.length;
  Object.keys(updatedVariables).forEach((variableName_) => {
    if (variableName_ === 'name') {
      item[variableName_] = `${updatedVariables[variableName_]}${item.index + 1}`;
    } else {
      item[variableName_] = updatedVariables[variableName_];
    }
  })
  fs.writeFileSync(
    path.join(exportNFTDir, `${item.index}.json`),
    JSON.stringify(item, null, 2)
  );
  printProgress(item.index, numberOfNFTs);
});

fs.writeFileSync(
  path.join(exportNFTDir, `_metadata.json`),
  JSON.stringify(metadata, null, 2)
);

console.log(`Updated '${Object.keys(updatedVariables)}' for metadata in: ${path.join(exportNFTDir, `_metadata.json`)}`);

console.log('\nPress any key to exit...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
