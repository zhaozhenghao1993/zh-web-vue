#!/bin/bash
echo "starting ..."
docker run -p 8000:80 -v /root/Projects/zh-web-vue/docker/nginx.conf:/etc/nginx/conf.d/default.conf --name zh-web-vue -d zhaozhenghao1993/zh-web-vue:1.0.0
echo "finished ..."