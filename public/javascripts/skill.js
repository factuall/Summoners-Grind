class Skill{
    constructor(keybind, label, cooldown){
        this.keybind = keybind;
        this.label = label;
        this.cooldown = cooldown;
        this.clock = 0;
    }
}