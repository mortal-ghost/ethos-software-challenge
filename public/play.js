const socket = io('/');
let resEle = document.querySelector("#result");
let audioEle = document.querySelector("#audio");
let musicPlayer = document.querySelector("#music-player");
let slider = document.querySelector("#slider");
let allComments = [];
currentMinute = 0, currentSecond = 0;
socket.emit('hello', AUDIO_ID);
let timecnt = 0;

const handleStampClick = (time) => {
    console.log('I am from time stamp click, and below is the time');
    console.log(time);
    audioEle.currentTime = time;
}

musicPlayer.addEventListener('click', (e) => {
    e.preventDefault();

    let totalDuration = audioEle.duration;
    let leftOffset = e.target.getBoundingClientRect().left;
    console.log(e.offsetX, leftOffset, e.target.offsetWidth);
    let currentDuration = ((e.offsetX) * totalDuration) / (e.target.offsetWidth);
    audioEle.currentTime = currentDuration;
});

const display = () => {
    timecnt++;
    let currentComment = [];
    let totalDuration = audioEle.duration;
    musicPlayer.removeChild(document.querySelector("#slider"));

    for (let i = 0; i < allComments.length; i++) {
        if (allComments[i].timestampMinutes == currentMinute && allComments[i].timestampSeconds == currentSecond) {
            currentComment.push(allComments[i]);
        }
    }
    if (timecnt % 10 == 0) {
        timecnt = 0;
    }

    document.getElementById('current-comment').innerHTML = "";

    if (currentComment.length > 0) {
        for (let i = 0; i < currentComment.length; i++) {
            document.getElementById('current-comment').innerHTML += `
            <div class="flex items-center w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3">
            <div>
                <h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">${currentComment[i].title}</h3>
                <p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
                    ${currentComment[i].content}
                </p>
            </div>
        </div>
            `
        }
    }
    currentMinute = Math.floor(audioEle.currentTime / 60);
    currentSecond = Math.floor(audioEle.currentTime % 60);
    musicPlayer.innerHTML += `<div id="slider" style="left: ${Math.floor((audioEle.currentTime * 100) / totalDuration)}%;" ></div> `;
    resEle.innerHTML = Math.floor(audioEle.currentTime / 60) + ":";
    resEle.innerHTML += Math.floor(audioEle.currentTime % 60) + "";
}
setInterval(display, 100);
const changeAudiotimer = (id) => {
    let time = idToTimeStamp[id - 1].time;
    audioEle.currentTime = time;
}
let idToTimeStamp = []
let count = 0;
const createComment = (comment) => {
    count++;
    let timeStamp = String(comment.timestampMinutes) + ":" + String(comment.timestampSeconds);
    let CommentTime = parseInt(comment.timestampMinutes) * 60 + parseInt(comment.timestampSeconds);

    let temp = (Math.floor((CommentTime * 100) / audioEle.duration)) + "%";
    musicPlayer.innerHTML += `<div onClick="handleStampClick(CommentTime)" class="stamp" style="left: ${temp};" ></div> `;
    idToTimeStamp.push({ count: count, time: parseInt(comment.timestampMinutes) * 60 + parseInt(comment.timestampSeconds) });
    document.getElementById('all-comments').innerHTML += `

    <div id=${count} onClick="changeAudiotimer(this.id)" class="flex hover:cursor-pointer items-center w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3">

  

    <div><h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">${comment.title}</h3>
      <p class="text-sm font-bold text-gray-300">${timeStamp}</p>
      <p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
      ${comment.content}</p>
    </div>
</div>
  `;


}
const displayComments = (comments) => {
    console.log('I am from display Comments');
    console.log(comments);
    document.getElementById('all-comments').innerHTML = "";
    for (let i = 0; i < comments.length; i++) {
        createComment(comments[i]);
    }

}
socket.on('comments', (comments) => {
    console.log('Hey! I got comments');
    allComments = comments;
    displayComments(comments);
    console.log(comments);
})

const addCommentBtn = document.getElementById('add-comment');
addCommentBtn.addEventListener('click', () => {
    const textArea = document.getElementById('textarea');
    let comment = textArea.value;
    const commentName = document.getElementById('comment-name');
    let name = commentName.value;
    if (!comment || !name) {
        return;
    }
    let tags = [];

    for (let i = 0; i < comment.length; i++) {
        if (comment[i] == '#') {
            i++;
            let word = "";
            for (i; i < comment.length; i++) {
                if (comment[i] == ' ') {
                    break;
                }
                else {
                    word += comment[i];
                }
            }
            tags.push(word);
        }
    }
    let finalcomment = { title: name, timestampMinutes: currentMinute, timestampSeconds: currentSecond, content: comment, tags: tags };
    console.log(finalcomment);
    socket.emit('addcomment', finalcomment);
    textArea.value = "";
    commentName.value = "";
});

const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-button');
console.log(searchBar);

socket.on('tagresults', (results) => {
    console.log(results);
    displayComments(results);
});

searchBtn.addEventListener('click', (e) => {
    if (searchBar.value == "") {
        socket.emit('hello', AUDIO_ID);
        return;
    }
    socket.emit('tagvalue', searchBar.value);
    searchBar.value = "";
});