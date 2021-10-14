import { CombatEntity } from './bases/BaseEntityCombat.js';
import * as graphics from "/js/graphics.js";
import * as mathhelper from "/js/math-helper.js";
import { objects } from "/js/wrapper.js";

export class Enemy extends CombatEntity{
    constructor(index){
        super(index);
        this.x = 400;
        this.y = 400;
        this.name = "Enemy";
        this.enemyname = "Range"
        //stats
        this.health = 60;
        this.maxHealth = 60;
        this.mana = 200;
        this.maxMana = 200;
        this.moveSpeed = 1;
        //combat
        this.range = 200;
        this.attackDamage = 20;
        this.attackSpeed = 8;
        //sprite
        this.drawContent = new graphics.Sprite("/img/lucznik.png", 50, 50);
    }
    updateObject(deltaTime){
        if(this.health > 0){
            if(this.target == "None"){
                let closest = "None";
                let closestDist = Number.MAX_SAFE_INTEGER;
                
                objects.forEach(element => {
                    if(element.name == "Player" || element.name == "Ally"){
                        let distance = mathhelper.GetDistanceBetweenObjects(this, element);
                        if(distance < closestDist){
                            closestDist = distance;
                            closest = element.index;
                        }
                    }
                });
                
                
                this.target = closest;
                
            }else{
                this.combatTarget(deltaTime);
            }
            super.updateObject(deltaTime);
        }
    }
}