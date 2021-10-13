var audioList = [];

function playSound(index){
    audioList[index].play();
}

function importAudio(file){
    audioList.push(new Audio(file));
    return audioList.length-1;
}

function tempAudioSrc(file){
    let src =  new Audio(file);
    src.play();
}