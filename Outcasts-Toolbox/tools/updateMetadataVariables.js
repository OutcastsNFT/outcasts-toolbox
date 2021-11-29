"use strict";

const path = require("path");
const fs = require("fs");
const { exportNFTDir } = require("../main/setupWorkspace");
const updatedVariables = require("../setup/updateMetadataVariables.json");

let rawMetadata = fs.readFileSync(path.join(exportNFTDir, `_metadata.json`));
let metadata = JSON.parse(rawMetadata);

metadata.forEach((item) => {
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
