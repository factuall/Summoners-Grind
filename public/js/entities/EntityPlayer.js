import { CombatEntity } from './bases/BaseEntityCombat.js';
import { Skill } from "/js/skill.js";
import * as graphics from "/js/graphics.js";
import { cursor } from "/js/mouse.js";
import * as mathhelper from "/js/math-helper.js";

const HTMLBEAK = "<br/>"
const HPBar = document.getElementById('HealthBar');
const MPBar = document.getElementById('ManaBar');
MPBar.style.backgroundColor = "rgb(75,75,255)";
const SkillsGUI = document.getElementsByClassName('Skill');
SkillsGUI[0].style.backgroundImage = "url('img/skillQ.png')"
SkillsGUI[1].style.backgroundImage = "url('img/skillW.png')"
SkillsGUI[2].style.backgroundImage = "url('img/skillE.png')"
SkillsGUI[3].style.backgroundImage = "url('img/skillR.png')"

export class Player extends CombatEntity{
    constructor(){
        super();
        this.name = "Player";
        this.inPosition = true;
        this.underAttack = true;
        //skills
        this.skills = [];
        this.skills.push(new Skill("SkillQ", 0, 60));
        this.skills.push(new Skill("SkillW", 1, 200));
        this.skills.push(new Skill("SkillE", 2, 300));
        this.skills.push(new Skill("SkillR", 3, 400));
        //sprite
        this.drawContent = new graphics.Sprite("/img/hipek.png", 50, 50);
        //camera flag
        this.cameraFollow = true;
        
    }

    updateObject(deltaTime){
        this.state = "move";
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
            this.combatTarget();
            if(this.target == "None"){
                this.state = "move";
                cursor.x = this.x;
                cursor.y = this.y;
            }
        }
        super.updateObject(deltaTime);
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

    tryTarget(object){
        if(object.name == "Enemy"){
            this.target = object.index;
            return true;
        }
        return false;
    }

    stopTargetting(){
        this.target = "None";
    }

    playerInput(e){
        this.skills.forEach(playerSkill => {
            if(e.type == playerSkill.keybind && playerSkill.clock > playerSkill.cooldown){
                playerSkill.clock = 0;
            }
        });
    }

    updateCursor(c){
        cursor = c;
    }
}