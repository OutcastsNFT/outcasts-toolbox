"use strict";

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require("canvas");

const { getRarityData } = require("./createRarityData.js");
const { exportUtilityDir } = require("../main/setupWorkspace.js");

const {
    headerBackgroundColor,
    backgroundColor,
    rowsPerColumn,
    titleFontSize,
    textFontSize,
    leftBarColor,
    nftNameColor,
    textColor,
    rarityColors: {
        legendary,
        common,
        exotic,
        epic,
        rare,
    }
} = require("../setup/previewConfig.json");

const assetSize = 300;
const assetSpacing = 1.3;
const marginTop = 120;

const getMaxHeight = (rarityData) => {
    let maxHeight = 1;
    Object.keys(rarityData).slice(0, Object.keys(rarityData).length - 2).forEach((layer) => {
        const assetNumber = Object.keys(rarityData[layer]).length;
        if (assetNumber > maxHeight) maxHeight = rowsPerColumn;
    })
    return maxHeight;
}

const getMaxWidth = (columnIndexes) => {
    let maxWidth = 0;
    Object.keys(columnIndexes).forEach((index) => {
        maxWidth += columnIndexes[index];
    })
    maxWidth = Math.ceil(assetSize * (maxWidth + 1) * 2);
    return maxWidth;
}

const getRarityThresholdColor = (rarity) => {
    if (rarity > 0 && rarity < 0.04) return exotic;
    if (rarity >= 0.04 && rarity < 0.2) return legendary;
    if (rarity >= 0.2 && rarity < 0.8) return epic;
    if (rarity > 0.8 && rarity < 6) return rare;
    if (rarity >= 6 && rarity <= 100) return common;
}

const getMaxColumns = (rarityData) => {
    let columnIndexes = {};
    Object.keys(rarityData).slice(0, Object.keys(rarityData).length - 2).forEach((layer, layerIndex) => {
        const assetNumber = Object.keys(rarityData[layer]).length;
        columnIndexes[layerIndex] = Math.ceil(assetNumber / rowsPerColumn);
    })
    return columnIndexes;
}

const executePreviewGeneration = async (rarityData) => {
    const paths = rarityData.paths;
    const nftNumber = rarityData.nftNumber;

    const columnIndexes = getMaxColumns(rarityData);

    const previewCanvasWidth = getMaxWidth(columnIndexes);
    const previewCanvasHeight = assetSize * getMaxHeight(rarityData) + assetSize * getMaxHeight(rarityData) * assetSpacing + marginTop;

    console.log(`Generating a rarityPreview that's ${previewCanvasWidth}x${previewCanvasHeight} pixels.`);

    const imageName = 'rarityPreview.png';
    const previewPath = path.join(exportUtilityDir, imageName);
    const previewCanvas = createCanvas(previewCanvasWidth, previewCanvasHeight);
    const previewCtx = previewCanvas.getContext("2d");

    previewCtx.fillStyle = backgroundColor;
    previewCtx.fillRect(0, 0, previewCanvasWidth, previewCanvasHeight);
    previewCtx.fillStyle = headerBackgroundColor;
    previewCtx.fillRect(0, 0, previewCanvasWidth, marginTop * 1.5);
    previewCtx.fillStyle = leftBarColor;
    previewCtx.fillRect(0, 0, 60, previewCanvasHeight);
    previewCtx.fillStyle = textColor;

    let calculatedColumnIndex = 0;
    let titleColumnIndex = 0;
    await Object.keys(rarityData).slice(0, Object.keys(rarityData).length - 2).forEach(async (layer, layerIndex) => {
        console.log('Generating -', layer)
        previewCtx.font = `${titleFontSize} Impact`
        const titleWidth = previewCtx.measureText(layer).width;
        for (let layerColumnIndex = 0; layerColumnIndex < columnIndexes[layerIndex]; layerColumnIndex++) {
            calculatedColumnIndex++;
            if (layerColumnIndex === 0) {
                titleColumnIndex = calculatedColumnIndex;
            }
        }
        let columnXCoordinate = Math.ceil(assetSize * assetSpacing * titleColumnIndex) * 1.5;
        previewCtx.fillRect(columnXCoordinate - assetSize / 2, marginTop * 1.5, 5, previewCanvasHeight);
        previewCtx.fillText(layer, columnXCoordinate + (assetSize - titleWidth) / 2, marginTop);

        let columnIndex = titleColumnIndex - 1;
        let rowIndex = 0;
        await Object.keys(rarityData[layer]).forEach(async (assetName, assetIndex) => {
            previewCtx.font = `${textFontSize} Calibri`;

            if (rowIndex < rowsPerColumn - 1 && assetIndex !== 0) rowIndex++; else { rowIndex = 0; columnIndex++; }

            const columnYCoordinate = assetSize * rowIndex * assetSpacing + assetSize * rowIndex + marginTop * 2;
            const assetColumnXCoordinate = Math.ceil(assetSize * assetSpacing * (columnIndex)) * 1.5;

            const assetOccurence = rarityData[layer][assetName];
            const formattedAssetOccurence = `Occurence: ${assetOccurence} / ${nftNumber} NFTs`;
            const assetRarity = (assetOccurence / nftNumber * 100).toFixed(2);
            const formattedAssetRarity = `Rarity: ${assetRarity}%`;

            const formattedAssetOccurenceWidth = previewCtx.measureText(formattedAssetOccurence).width;
            const formattedAssetOccurenceHeight = previewCtx.measureText(formattedAssetOccurence).actualBoundingBoxAscent;
            const formattedAssetRarityWidth = previewCtx.measureText(formattedAssetRarity).width;
            const assetNameWidth = previewCtx.measureText(assetName).width;

            const assetPath = paths[`${layer}-${assetName}`];

            await loadImage(assetPath).then((image) => {
                previewCtx.drawImage(
                    image,
                    assetColumnXCoordinate,
                    columnYCoordinate,
                    assetSize,
                    assetSize
                );
                const textYCoordinate = columnYCoordinate + assetSize + marginTop / 2;
                previewCtx.fillStyle = nftNameColor;
                previewCtx.fillText(assetName, assetColumnXCoordinate + (assetSize - assetNameWidth) / 2, textYCoordinate);
                previewCtx.fillStyle = textColor;
                previewCtx.fillText(formattedAssetOccurence, assetColumnXCoordinate + (assetSize - formattedAssetOccurenceWidth) / 2, textYCoordinate + formattedAssetOccurenceHeight * 1.5);
                previewCtx.fillStyle = getRarityThresholdColor(assetRarity);
                previewCtx.fillText(formattedAssetRarity, assetColumnXCoordinate + (assetSize - formattedAssetRarityWidth) / 2, columnYCoordinate + assetSize + marginTop / 2 + formattedAssetOccurenceHeight * 3);
                previewCtx.fillStyle = textColor;
            });
        })
    })

    console.log(`\nSaving preview as "${imageName}" ...`);
    fs.writeFileSync(previewPath, previewCanvas.toBuffer("image/png"));
    console.log(`Project preview image saved! Location: ${previewPath}`);
}

const generateRarityPreview = async () => {
    const rarityData = getRarityData();
    await executePreviewGeneration(rarityData);
}

generateRarityPreview();