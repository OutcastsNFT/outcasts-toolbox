@echo off
cd "../Outcasts-Toolbox"
set "reply=y"
set /p "reply=Enable random rarities? this will ignore the rarities set up after '#' in assets and use random ones. [y | n]: "
if /i not "%reply%" == "y" node index.js
if /i "%reply%" == "y" node index.js --random-rarity-enabled
