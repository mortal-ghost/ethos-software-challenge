function VideoInput() {
    return (
        <div className="flex items-center">
          <div className="w-1/2 flex items-center justify-center">
            <img src="/main.png" alt="main" className="w-3/4 p-10" />
          </div>
          <div className="border-2 border-dashed self-center rounded-2xl bg-white p-8 md:w-1/2 items-center m-2 flex flex-col justify-center">
            <img width="200px" src="/file.svg" alt="Upload" />
    
            <div className="mt-4 mb-1">
              <h2 className="text-2xl">
                Select a file to share
              </h2>
            </div>
            <form action="/api/files/" enctype="multipart/form-data" className="flex flex-col justify-center items-center text-sm" method="post">
              <input type="file" name="file" className="ml-[75px]" id="file-input" required />
    
              <button className="mt-4 w-[150px] bg-[#6E41E2] hover:bg-[#875bf6] text-white py-2 px-4 rounded-lg" type="submit">
                Upload
              </button>
            </form>
          </div>
        </div>
      );
}

export default VideoInput;
