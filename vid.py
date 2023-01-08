import moviepy.editor as mp
import os
import sys

videoname = sys.argv[1]
clip = mp.VideoFileClip(videoname)
audioname = videoname.split('.')[0] + '.mp3'
clip.audio.write_audiofile(audioname)

quit(0)