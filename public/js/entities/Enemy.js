import { CombatEntity } from './bases/CombatEntity.js';
import * as graphics from "/js/graphics.js";
import * as mathhelper from "/js/mathhelper.js";
import { objects } from "/js/gamemodule.js";

export class Enemy extends CombatEntity{
    constructor(isRange){
        super();
        this.isRange = isRange;
        this.x = 400;
        this.y = 400;
        this.name = "Enemy";
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
        //this.drawContent = (this.isRange) ? new graphics.Sprite("/img/lucznik.png") :
        //                                    new graphics.Sprite("/img/miecznik.png");
        let enemyImage = new graphics.Sprite("/img/character/BODY_skeleton.png");
        let enemySprite = new graphics.SpriteSheet(enemyImage, 4, 9, 64, 64);
        this.defaultSprites = enemySprite;
        this.attackSprites = enemySprite;
        this.drawContent = enemySprite;
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
                let xy = mathhelper.GetFacingVectorCC(this, objects[this.target]);
                if(Math.abs(xy.x) > Math.abs(xy.y)){
                    if(xy.x > 0){
                        this.drawContent.setOffset(this.currentFrame, 1);
                    }else{
                        this.drawContent.setOffset(this.currentFrame, 3);
                    }
                }else{
                    if(xy.y > 0){
                        this.drawContent.setOffset(this.currentFrame, 0);
                    }else{
                        this.drawContent.setOffset(this.currentFrame, 2);
                    }
                }
                this.combatTarget(deltaTime);
            }
            super.updateObject(deltaTime);
        }
    }
}