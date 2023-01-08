const socket = io('/');
alert('Hello World');

const tag = document.getElementById('tagsearch');
const submitButton = document.getElementById('buttonSubmit');
const tagsearchresults = document.getElementById('tagsearchresults');
console.log(submitButton);

submitButton.addEventListener('click',()=>{
    console.log('clicked');
    console.log(tag.value);
    socket.emit('tagvalue',tag.value);
});
socket.on('tagresults',(results)=>{
    console.log(results);

    for(let i = 0;i<results.length;i++){

        tagsearchresults.innerHTML+=`
            <h1> Title ${results[i].title}<\h1>
            <h3> Title ${results[i].content}<\h3>
        `;
    }
})

const clearbtn = document.getElementById('clear');

clearbtn.addEventListener('click',()=>{
    tagsearchresults.innerHTML = "";
})
socket.emit('indexhello','indexhello');