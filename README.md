# Outcasts Toolbox
### This is a ToolBox for creating awesome generative projects on Solana
Made with love by the Outcasts team ❤️

![N|Solid](https://raw.githubusercontent.com/OutcastsNFT/outcasts-toolbox/master/exampleImages/banner.jpeg?token=AWPD7XQYSZF2ISTMOQGUNMDBUPVAS)

This tool was made with inspiration from the hashlips-art-engine.
## INSTALLATION
### Step 1: Installing the things you need for the program to run
**Windows**
- Install GitBash (I recommend using this over powershell or the windows cmd): https://git-scm.com/download/win
- Install NODE JS (this is so that the program can be ran): you can download it from here: https://nodejs.org/en/download/
- Install yarn (this is a package manager): 
    1) Right click in any folder and select the "Git Bash Here" option. This will open a Git Bash terminal;
    2) Copy and paste this command:
    ```sh
    npm install --global yarn
    ```

**MACOS and LINUX**
- Install NODE JS: Follow theese steps here->https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/;
- Install yarn (this is a package manager developed by Facebook): Open a new terminal and copy and paste this command:
    ```sh
    npm install --global yarn
    ```

### Step 2: Setting everything up
**WINDOWS**
- We made this very easy, if you are on windows just run the "Install Dependencies.bat" file and let it do its thing, it will automatically close after finishing.

**MACOS and LINUX**
- Open a new terminal inside the Outcasts-Toolbox folder and run
    ```sh
    yarn install
    ```

**Now you should have everything set up and ready! :)**

## USAGE
### GENERATION

1) Setting up the layers: Go to the "setup" folder inside "Outcasts-Toolbox" then inside the "assets" folder and create a folder for every layer, the name of the folder will be the attribute type (Example: "Background" or "Headwear");

2) Have all the layer folders done? Great! Now open the "config.json" file inside the same "setup" folder with a program la VSCode or Notepad++ and write the order of the layers from back to front,
	it should look something like this:

    ![N|Solid](https://raw.githubusercontent.com/OutcastsNFT/outcasts-toolbox/master/exampleImages/layersOrder.PNG?token=AWPD7XR46WKU3NTYHWN2VO3BUPVC2)

3) We that we have all the layers set up, it's time to add some assets, get yours and put them in their respective folder, named like this: <YOUR_ASSET_NAME#RARITY.png>, for example: "Berserker Blue#1.png".
	The asset name is self explanatory, but what about the rarity? it's simple, if all the rarities add up to 100 it's like a percent, 0.1 meaning that 0.1% of NFTs will have this asset, but if they don't add up to 100 you can see
	the percentage using this formula: RARITY_IN_PERCENT = (RARITY * SUM_OF_ALL_RARITIES) / 100. Too keep things simple we recommend setting them so that they add up to 100.
	
4) Set the number of NFTs you want to generate: in the same "config.json" set the "numberOfNFTs" to the number you want to generate.

5) Set the "imageSize" width and height to the size that your assets are.

6) Set the "nftDescription" to whatever you want. (must be text)

7) Set the "collection" attribute, this is self explanatory.

8) Set the "creators" and "royaltiesPercentage", this is for the royalties, for more info on this check this out: https://medium.com/metaplex/metaplex-metadata-standard-45af3d04b541; The roayltiesPercentage is * 100 so 500 = 5%;

> !!!WARNING!!!
> 	This is a probability game so if you put for example: 0.1 as rarity and you generate 3333 NFTs, that asset can appear anywhere from 0 times to 3-4 times. So just keep that in mind.

9) Generation: if you are on windows you can simply run the "Start Generation.bat" file, it will prompt you to choose whether to use the rarities you set up in step 3) or to let the program randomly decide the rarities.
	If you are not on windows, open a terminal in the "Outcasts-Toolbox" folder and run this command:
	```sh
	node index.js
	```
	likewise, if you want to choose the random rarities option run this command:
	```sh
	node index.js --random-rarity-enabled
	```
	
10) The program will generate all the NFTs then prompt you to press any key to close once its finished, now enjoy your newly generated NFTs (they all have the metadata automatically generated so you don't have to worry about that); They will be in "Outcasts-Toolbox/exported/NFTs" folder.

### GETTING A RARITY TABLE
- Every NFT project should have the rarity table image that the community can check out, to do this on Windows run the "Create Rarity Table.bat" file and wait for it to generate, it will be found inside the "Outcasts-Toolbox/exported/Utils" folder. If you are not on Windows open a terminal inside the "Outcasts-Toolbox" folder and run this command:
    ```sh
    node .\tools\createRarityPreview.js 
    ```
    The program generates a rarity table that looks something like this by default:

    **-- This is dummy data from a test--**

    ![N|Solid](https://raw.githubusercontent.com/OutcastsNFT/outcasts-toolbox/master/exampleImages/rarityPreview.png?token=AWPD7XVHS7DZG2ZSWFZFY53BUPVD2)
    
- Keep in mind you can customize the colors, how many assets are displayed per column (rowsPerColumn) and font sizes inside the "previewConfig.json" file next to "config.json". Feel free to be creative with it! :)
- You can also go into the createRarityPreview.js file in the "tools" folder and modify the rarity threshholds (line: 51) if you want to set the rarity types to different percentages. (exotic, legendary, epic, etc.)

### INJECTING CUSTOM PIECES

- You might find yourself in the situation when you really want certain attribute combinations to appear in your project without adding it manually and risking duplicates, we know we have! thats why we added a Custom Piece Injection feature. It will inject the custom unique combinations at random indexes among the collection and will check if it has allready been randomly generated, in which case it will skip it since it allready exists.
- To configure the custom pieces you have to go into the "config.json" file and add the combinations inside the "uniquePieces" variable, each unique piece should have the attributes set in the layer order we discussed above and it should follow this convension: "LAYER": "ASSET", for example: ** "Background": "Cyan Sunrise" **. After you are done it should look something like this:

    ![N|Solid](https://raw.githubusercontent.com/OutcastsNFT/outcasts-toolbox/master/exampleImages/uniqueInjections.PNG?token=AWPD7XV45W7VEJLE2FYRQG3BUPVE6)

    In this case we have 2 custom pieces that are going to be injected, each is determined by the brackets ( "{}" ) and are separated by a comma.

****
### THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

