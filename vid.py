import moviepy.editor as mp
import requests as rq
import os

import sys

def vid_to_aud(vidname):
    fpath = "videos/" + vidname
    clip = mp.VideoFileClip(fpath)
    apath = "audio/" + vidname + ".mp3"
    clip.audio.write_audiofile(apath)
vid_to_aud(fname)