const socket = io('/');
let resEle = document.querySelector("#result");
let audioEle = document.querySelector("#audio");

currentMinute = 0, currentSecond = 0;
socket.emit('hello', AUDIO_ID);
const display = () => {
    currentMinute = Math.floor(audioEle.currentTime / 60);
    currentSecond = Math.floor(audioEle.currentTime % 60);
    resEle.innerHTML =  Math.floor(audioEle.currentTime / 60) + ":";
    resEle.innerHTML +=  Math.floor(audioEle.currentTime % 60) + "";

}
setInterval(display, 100);

let cnt = 0;
const createComment = (comment) => {

    let timeStamp = String(comment.timestampMinutes) + ":" + String(comment.timestampSeconds);

    document.getElementById('all-comments').innerHTML += `
    <div id = ${cnt}>
    <h3> ${comment.title}<\h3>

    <h4> ${timeStamp}<\h4>
    <p>  ${comment.content} <\p>  
    <\div>  
  `;


}
const displayComments = (comments) => {
    document.getElementById('all-comments').innerHTML = "";
    for (let i = 0; i < comments.length; i++) {
        createComment(comments[i]);
    }

}
socket.on('comments', (comments) => {
    console.log('Hey! I got comments');
    displayComments(comments);
    console.log(comments);
})

const addCommentBtn = document.getElementById('add-comment');
addCommentBtn.addEventListener('click', () => {
    const textArea = document.getElementById('textarea');
    let comment = textArea.value;
    const commentName = document.getElementById('comment-name');
    let name = commentName.value;
    let finalcomment = { title: name, timestampMinutes: currentMinute, timestampSeconds: currentSecond, content: comment };
    console.log(finalcomment);
    socket.emit('addcomment', finalcomment);
    textArea.value = "";
    commentName.value = "";
})
