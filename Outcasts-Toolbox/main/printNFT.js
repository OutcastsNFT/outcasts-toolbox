"use strict";

const fs = require("fs");
const { createCanvas, loadImage } = require('canvas')

const { exportNFTDir, configFile } = require("./setupWorkspace");
const {
    royaltiesPercentage,
    nftDescription,
    external_url,
    collection,
    imageSize,
    creators,
    symbol,
    name
} = require(configFile);

const canvas = createCanvas(imageSize.width, imageSize.height);
const ctx = canvas.getContext('2d');

const handleMetadata = (attributes, index) => {
    const metadata = {
        name: `${name} #${index + 1}`,
        symbol: symbol,
        description: nftDescription,
        seller_fee_basis_points: royaltiesPercentage,
        image: `image.png`,
        external_url: external_url,
        index,
        attributes,
        generator: "Outcasts Toolbox",
        collection: collection,
        properties: {
            files: [
                {
                    uri: "image.png",
                    type: "image/png"
                }
            ],
            category: "image",
            creators: creators,
        },
    }
    fs.writeFileSync(
        `${exportNFTDir}/${index}.json`,
        JSON.stringify(metadata, null, 2)
    );
    return metadata;
}

const printNFT = async (attributes, generatedData, attributesForMetadata) => {
    ctx.clearRect(0, 0, imageSize.width, imageSize.height);
    await attributes.forEach(async (path) => {
        await loadImage(path).then((image) => {
            ctx.drawImage(
                image,
                0,
                0,
                imageSize.width,
                imageSize.height
            );
        });
    })
    fs.writeFileSync(`${exportNFTDir}/${generatedData}.png`, canvas.toBuffer("image/png"));
    const metadata = handleMetadata(attributesForMetadata, generatedData);
    return metadata;
}

module.exports = {
    printNFT
};