var audioList = [];

// use this if sound wouldn't be playing more than
// one playback at the same moment
export function playSound(index){
    audioList[index].play();
}

export function importAudio(file){
    audioList.push(new Audio(file));
    return audioList.length-1;
}

// this have to be like that because if you want
// to play same sound as many times as you want at the same moment
export function playSoundAsync(file){
    let src =  new Audio(file);
    src.play();
}