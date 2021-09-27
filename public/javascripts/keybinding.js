class Keybind{
    constructor(name, key){
        this.name = name;
        this.pressedEvent = new Event(name);
        this.keycode = "";
        this.displayKey = "";
        this.bindNewKey(key);
        this.guiChangeButton = document.createElement("div");
        this.guiChangeButton.className = "BindButton";
        this.guiChangeButton.innerHTML = "[" + this.displayKey + "] ";
        this.guiOption = document.createElement("div");
        this.guiOption.className = "Keybind";
        this.guiOption.append(this.guiChangeButton);
        this.guiOption.append(this.name);

    }
    bindNewKey(key){
        this.keycode = key;
        if(key.startsWith("Digit") || key.startsWith("Key")){
            this.displayKey = key.slice(-1);
        }else{
            this.displayKey = key;
        }
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
        if(k.keycode == e.code){
            k.bindPressed();
        }
    });
});

var ControlsGui = document.getElementById('ControlsGuiContent');


controls.forEach(k =>{
    ControlsGui.appendChild(k.guiOption);
});
