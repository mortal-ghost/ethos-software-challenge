const uploadBtn = document.getElementById('upload');

uploadBtn.addEventListener('submit', () => {
    const file = document.getElementById('file').files[0];
    const name = document.getElementById('file-title').value;

    console.log(file, name);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    fetch('/files', {
        method: 'POST',
        body: formData
    }).then((res) => {
        if (res.status == 200) {
            window.location.href = `/play_music/${res.id}`;
        } else {
            window.location.href = '/error';
        }
    }).catch((err) => {
        console.log(err);
    });
});