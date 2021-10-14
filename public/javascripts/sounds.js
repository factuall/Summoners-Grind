var audioList = [];

export function playSound(index){
    audioList[index].play();
}

export function importAudio(file){
    audioList.push(new Audio(file));
    return audioList.length-1;
}

export function tempAudioSrc(file){
    let src =  new Audio(file);
    src.play();
}