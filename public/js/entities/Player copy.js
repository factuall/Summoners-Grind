import { CombatEntity } from './bases/CombatEntity.js';
import * as graphics from "/js/graphics.js";
import { cursor } from "/js/mouse.js";
import { controls } from "/js/keybinding.js";
import * as mathhelper from "/js/mathhelper.js";

const HTMLBEAK = "<br/>"
const HPBar = document.getElementById('HealthBar');
const MPBar = document.getElementById('ManaBar');
MPBar.style.backgroundColor = "rgb(75,75,255)";
const SkillsGUI = document.getElementsByClassName('Skill');
SkillsGUI[0].style.backgroundImage = "url('img/skills/44.png')"
SkillsGUI[1].style.backgroundImage = "url('img/skills/23.png')"
SkillsGUI[2].style.backgroundImage = "url('img/skills/10.png')"
SkillsGUI[3].style.backgroundImage = "url('img/skills/4.png')"

class Skill{
    constructor(keybind, keybindNumber, cooldown, skillFunction){
        this.keybind = keybind;
        this.skillFunction = skillFunction;
        this.keybindNumber = keybindNumber;
        this.label = controls[keybindNumber].displayKey;
        this.cooldown = cooldown;
        this.clock = 0;
    }

    updateSkillLabel(){
        this.label = controls[this.keybindNumber].displayKey;
    }
}

export class Player extends CombatEntity{
    constructor(){
        super();
        this.isRange = true;
        this.name = "Player";
        this.inPosition = true;
        this.underAttack = true;
        this.state = "move";
        //skills
        this.skills = [];
        this.skills.push(new Skill("SkillQ", 0, 60, ()=>{}));
        this.skills.push(new Skill("SkillW", 1, 200, ()=>{}));
        this.skills.push(new Skill("SkillE", 2, 300, ()=>{}));
        this.skills.push(new Skill("SkillR", 3, 400, ()=>{}));
        //sprites
        this.animController = this.loadSprites();
        this.drawContent = "#333333";
        //camera flag
        this.cameraFollow = true;
        document.addEventListener("cursorClick", e => {
            this.tryTarget(e.detail);
        });
    }

    updateObject(deltaTime){
        
        if(this.state == "move"){
            this.inPosition = (mathhelper.CollisionDetection(this, cursor));
            if(!this.inPosition){
                let destination = mathhelper.GetFacingVectorCC(this, cursor);
                this.move(-destination.x*4*deltaTime,-destination.y*4*deltaTime);
            }
            this.skills.forEach(playerSkill => {
                playerSkill.clock += deltaTime;
            });
        }else if(this.state == "target"){
            this.combatTarget(deltaTime);
            if(this.target == "None"){
                cursor.ox = this.ox;
                cursor.oy = this.oy;
            }
        }
        if(this.animController != undefined){

        
        console.log(this.animController);
        let ctrl = this.animController;
        ctrl.controllerUpdate(deltaTime);
        //this.drawContent = animController.getCurrentSprite();
        super.updateObject(deltaTime);
        }   
    }

    renderObject(){
        /************GUI***********/
        //health and mana bars
        HPBar.innerHTML = this.health + " / " + this.maxHealth;
        if(this.health > 0) HPBar.style.width = (100 * (this.health / this.maxHealth)) - 1 + "%";
        else HPBar.style.width = "0px";
        MPBar.innerHTML = this.mana + " / " + this.maxMana;
        if(this.mana > 0) MPBar.style.width = (100 * (this.mana / this.maxMana)) - 1 + "%";
        else MPBar.style.width = "0px";
        //skills
        this.skills.forEach(function(playerSkill, i){
            playerSkill.updateSkillLabel();
            SkillsGUI[i].style.filter = (playerSkill.clock >= playerSkill.cooldown) ? "brightness(100%)" : "brightness(50%)";
            let timeLeft = (playerSkill.cooldown - playerSkill.clock) / 60;
            SkillsGUI[i].innerHTML = playerSkill.label + ((playerSkill.clock >= playerSkill.cooldown) ? "" : HTMLBEAK + timeLeft.toFixed(1) + "s");
        });        
        return super.renderObject();
    }

    tryTarget(clickedList){
        let newTarget;
        clickedList.forEach(e => {
            if(e.name == "Enemy"){
                this.target = e.index;
                newTarget = e;
            }
        });
        if(newTarget == undefined){
            this.state = "move";
            return false;
        }else{
            this.state = "target";
            return true;
        }
    }

    playerInput(e){
        this.skills.forEach(playerSkill => {
            if(e.type == playerSkill.keybind && playerSkill.clock > playerSkill.cooldown){
                playerSkill.clock = 0;
                openMenu();
            }
        });
    }

    updateCursor(c){
        cursor = c;
    }

    loadSprites(){
        let output = [];

        output.push(new graphics.Sprite("/img/character/tile000"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile001"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile002"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile003"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile004"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile005"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile006"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile007"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile008"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile009"+".png", 64, 64));

        output.push(new graphics.Sprite("/img/character/tile010"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile011"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile012"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile013"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile014"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile015"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile016"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile017"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile018"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile019"+".png", 64, 64));

        output.push(new graphics.Sprite("/img/character/tile020"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile021"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile022"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile023"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile024"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile025"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile026"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile027"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile028"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile029"+".png", 64, 64));

        output.push(new graphics.Sprite("/img/character/tile030"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile031"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile032"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile033"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile034"+".png", 64, 64));
        output.push(new graphics.Sprite("/img/character/tile035"+".png", 64, 64));
        
        let input = output;

        let animLength = 9;
        let anims = 4;
        
        let animations = [];
        
        let curAn = [];

        for (let frames = 0; frames < (animLength)*anims; frames++) {
            curAn.push(input[frames]);
            if(frames == animLength - 1 || frames == (animLength * 2) - 1 || frames == (animLength * 3) - 1){
                animations.push(new graphics.Animation(curAn, 5, true));
                curAn = [];
            }
            
        }
        animations.push(new graphics.Animation(curAn, 5, true));
        let controller = new graphics.AnimationController(animations, animations[0]);
        return controller;
    }
}