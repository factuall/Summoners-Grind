class Skill{
    constructor(keycode, label, cooldown){
        this.keycode = keycode;
        this.label = label;
        this.cooldown = cooldown;
        this.clock = 0;
    }
}