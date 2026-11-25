#!/bin/sh
set -e
cd "$(dirname "$0")"
r=renders
in=$r/plantao-24h.mp4
T=44.53125
ffmpeg -v error -y -i "$in" -ss 0.485 -t $T -i assets/audio/music.wav \
  -i assets/audio/vo-1.wav -i assets/audio/vo-2.wav -i assets/audio/vo-3.wav -i assets/audio/vo-4.wav \
  -i assets/audio/vo-5.wav -i assets/audio/vo-6.wav -i assets/audio/vo-7.wav -i assets/audio/vo-3b.wav \
  -filter_complex "[1:a]volume=0.4,apad,afade=t=out:st=43.73:d=0.8[m];[2:a]adelay=200:all=1[v1];[3:a]adelay=6644:all=1[v2];[4:a]adelay=18422:all=1[v3];[5:a]adelay=28266:all=1[v4];[6:a]adelay=33866:all=1[v5];[7:a]adelay=37916:all=1[v6];[8:a]adelay=41716:all=1[v7];[9:a]adelay=22138:all=1[v1b];[v1][v2][v3][v4][v5][v6][v7][v1b]amix=inputs=8:normalize=0[vo];[m][vo]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t $T -movflags +faststart $r/plantao-24h-vo.mp4
for v in plantao-24h plantao-24h-vo; do
  ffmpeg -v error -y -i $r/$v.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11" -ar 48000 -c:a aac -b:a 192k -movflags +faststart $r/$v.tmp.mp4 && mv $r/$v.tmp.mp4 $r/$v.mp4
  ffmpeg -v error -y -i $r/$v.mp4 -vf "crop=1080:1350:0:285" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart $r/$v-4x5.mp4
done
ls -1 $r
