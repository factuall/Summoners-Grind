import { CombatEntity } from './bases/CombatEntity.js';
import * as graphics from "/js/graphics.js";
import { cursor } from "/js/mouse.js";
import { controls } from "/js/keybinding.js";
import * as mathhelper from "/js/mathhelper.js";
import { render } from '../graphics.js';

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
        this.w = 80;
        this.h = 80;
        this.inPosition = true;
        this.underAttack = true;
        this.state = "move";
        this.attackSpeed = 30;
        //skills
        this.skills = [];
        this.skills.push(new Skill("SkillQ", 0, 60, ()=>{}));
        this.skills.push(new Skill("SkillW", 1, 200, ()=>{}));
        this.skills.push(new Skill("SkillE", 2, 300, ()=>{}));
        this.skills.push(new Skill("SkillR", 3, 400, ()=>{}));
        //sprite
        let spriteImage = new graphics.Sprite("/img/character/BODY_male.png");
        this.defaultSprites = new graphics.SpriteSheet(spriteImage, 4, 9, 64, 64);
        this.defaultSprites.name = "walk";
        this.drawContent = this.defaultSprites;

        let spriteImageATK = new graphics.Sprite("/img/character/BODY_animation.png");
        this.attackSprites = new graphics.SpriteSheet(spriteImageATK, 4, 12, 64, 64);
        this.attackSprites.name = "attack";

        let bowAttackImage = new graphics.Sprite("/img/character/WEAPON_bow.png");
        this.bowAttackSprites = new graphics.SpriteSheet(bowAttackImage, 4, 12, 64, 64);

        this.currentDir = 0;

        this.cameraFollow = true;
        document.addEventListener("cursorClick", e => {
            this.tryTarget(e.detail);
        });
    }

    updateObject(deltaTime){
        if(this.state == "move"){
            this.drawContent = this.defaultSprites;
            this.inPosition = (mathhelper.CollisionDetection(this, cursor));
            if(!this.inPosition){
                let destination = mathhelper.GetFacingVectorCC(this, cursor);
                this.move(-destination.x*this.moveSpeed*deltaTime,-destination.y*this.moveSpeed*deltaTime);
                this.playing = true;
            }else{
                this.playing = false;
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
        let xy = mathhelper.GetFacingVectorCC(this, cursor);
        if(Math.abs(xy.x) > Math.abs(xy.y)){
            if(xy.x > 0){
                this.drawContent.setOffset(this.currentFrame, 1);
                this.currentDir = 1;
            }else{
                this.drawContent.setOffset(this.currentFrame, 3);
                this.currentDir = 3;
            }
        }else{
            if(xy.y > 0){
                this.drawContent.setOffset(this.currentFrame, 0);
                this.currentDir = 0;
            }else{
                this.drawContent.setOffset(this.currentFrame, 2);
                this.currentDir = 2;
            }
        }
        this.playingAnimation(deltaTime);
        super.updateObject(deltaTime);
    }

    playingAnimation(deltaTime){
        super.playingAnimation(deltaTime);
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

        if(this.drawContent.name == "attack") {
            let renderList = [];
            renderList.push({
                x: this.x,
                y: this.y,
                w: this.w,
                h: this.h,
                drawContent: this.bowAttackSprites
            });
            this.bowAttackSprites.currentColumn = this.currentFrame;
            this.bowAttackSprites.currentRow = this.currentDir;

            let rest = super.renderObject();
            rest.push({
                x: this.x,
                y: this.y,
                w: this.w,
                h: this.h,
                drawContent: this.bowAttackSprites
            });

            return rest;
        }else{
            return super.renderObject();
        }

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
}