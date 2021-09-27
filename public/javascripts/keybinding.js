const BIND_BUTTON_COLOR = "bisque";
const BIND_BUTTON_COLOR_PRESSED = "white";

class Keybind{
    constructor(name, key){
        this.name = name;
        this.pressedEvent = new Event(name);
        this.keycode = "";
        this.displayKey = "";
        this.guiChangeButton = document.createElement("div");
        this.guiChangeButton.className = "BindButton";
        this.guiOption = document.createElement("div");
        this.guiOption.className = "Keybind";
        this.guiOption.append(this.guiChangeButton);
        this.guiOption.append(this.name);
        this.changingButton = false;
        this.bindNewKey(key);
    }
    bindNewKey(key){
        this.keycode = key;
        if(key.startsWith("Digit") || key.startsWith("Key")){
            this.displayKey = key.slice(-1);
        }else{
            this.displayKey = key;
        }
        this.guiChangeButton.innerHTML = this.displayKey;
    }
    bindPressed(){
        dispatchEvent(this.pressedEvent);
    }
}

var controls = [];
controls.push(new Keybind("First Skill", "KeyQ"));
controls.push(new Keybind("Second Skill", "KeyW"));
controls.push(new Keybind("Third Skill", "KeyE"));
controls.push(new Keybind("Ultimate Skill", "KeyR"));
document.addEventListener('keypress', e =>{
    controls.forEach(k =>{

        if(k.changingButton){
            k.bindNewKey(e.code);
            k.changingButton = false;
            k.guiChangeButton.style.backgroundColor = BIND_BUTTON_COLOR;
        }
        if(k.keycode == e.code){
            k.bindPressed();
        }
    });
});

var ControlsGui = document.getElementById('ControlsGuiContent');


controls.forEach(k =>{
    ControlsGui.appendChild(k.guiOption);
    k.guiChangeButton.addEventListener('click', function(){
        k.changingButton = !k.changingButton;
        if(k.changingButton) k.guiChangeButton.style.backgroundColor = BIND_BUTTON_COLOR_PRESSED;
        else k.guiChangeButton.style.backgroundColor = BIND_BUTTON_COLOR;
    });
});
