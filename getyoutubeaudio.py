from pytube import YouTube
import os,sys

# url input from user
n = len(sys.argv)
print("Total arguments passed:", n)
if n != 3:
    print('Please follow the format')
    quit()
yt = YouTube(
    str(sys.argv[1]))
video = yt.streams.filter(only_audio=True).first()
  
# check for destination to save file
print("Enter the destination (leave blank for current directory)")
destination = str("public/audio")

out_file = video.download(output_path=destination)
  
# save the file
base, ext = os.path.splitext(out_file)
new_file = destination + "/" +sys.argv[2] + '.mp3'
os.rename(out_file, new_file)
# new_file_temp = sys.argv[2] + '.mp3'
# os.rename(new_file, new_file_temp)

# result of success
print(yt.title + " has been successfully downloaded.")