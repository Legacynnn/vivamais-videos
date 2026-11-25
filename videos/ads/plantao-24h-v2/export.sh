#!/bin/sh
set -e
cd "$(dirname "$0")"
r=renders
v=plantao-24h-v2
ffmpeg -v error -y -i $r/$v.mp4 -c:v copy -ar 48000 -c:a aac -b:a 192k -movflags +faststart $r/$v.tmp.mp4 && mv $r/$v.tmp.mp4 $r/$v.mp4
ffmpeg -v error -y -i $r/$v.mp4 -vf "crop=1080:1350:0:285" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart $r/$v-4x5.mp4
ls -1 $r
