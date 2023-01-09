#!/bin/bash
mkdir -p js/
minify src/init.js > js/init.js
minify src/rpg.js > js/rpg.js
minify src/tab.js > js/tab.js