import moviepy.editor as mp
import sys

videoName=sys.argv[1]
audioName=videoName.split('.')[0] + '.wav'

clip = mp.VideoFileClip(videoName)

print("Video file name: " + sys.argv[1])
print(audioName)
print("Converting video to audio...")
clip.audio.write_audiofile(audioName)
