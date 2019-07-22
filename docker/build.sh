#!/bin/bash
echo "build starting ..."
cd ..
docker build -t zhaozhenghao1993/zh-web-vue:1.0.0 .
echo "build finished ..."