function Features(){
    return (
        <div className=" pt-6 mt-4 bg-purple-400">
            <ul className="sm:flex sm:flex-wrap justify-center ">
                <li className="mb-6 flex flex-col items-center text-center lg:w-[25%] md:w-[33%] sm:w-[50%] w-full">
                    <div className="block">
                        <img className=""  src="/audio.svg" alt="feature1"></img>
                    </div>
                    <h2 className="text-white text-[1.5em] block">Extract Audio from Video</h2>
                </li>
                
                <li className="mb-6 flex flex-col items-center text-center lg:w-[25%] md:w-[33%] sm:w-[50%] w-full">
                    <div className="block">
                        <img className="" src="/video_file.svg" alt="feature2"></img>
                    </div>
                    <h2 className="text-white text-[1.5em] block" >Convert any Video</h2>
                </li>

                <li className="mb-6 flex flex-col items-center text-center lg:w-[25%] md:w-[33%] sm:w-[50%] w-full">
                    <div className="block">
                        <img className="" src="/comment.svg" alt="feature3"></img>
                    </div>
                    <h2 className="text-white text-[1.5em] block" >Add Comments in Realtime</h2>
                </li>
            </ul>
        </div>
    );
}
export default Features;