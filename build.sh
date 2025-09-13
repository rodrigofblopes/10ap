#!/bin/bash
cd _source/5D
npm install
npm run build
cp -r dist/* ../../
