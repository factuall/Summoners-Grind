import { controls } from './keybinding.js'

export class Skill{
    constructor(keybind, keybindNumber, cooldown){
        this.keybind = keybind;
        this.keybindNumber = keybindNumber;
        this.label = controls[keybindNumber].displayKey;
        this.cooldown = cooldown;
        this.clock = 0;
    }

    updateSkillLabel(){
        this.label = controls[this.keybindNumber].displayKey;
    }
}