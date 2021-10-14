import { Entity } from "/js/entities/bases/Entity.js";
import { CombatEntityInfo } from "/js/entities/EntityCombatInfo.js";
import { objects, pushObject } from "/js/wrapper.js";
import * as mathhelper from "/js/mathhelper.js";
import { cursor } from "/js/mouse.js";
import { Projectile } from "/js/entities/EntityProjectile.js";

export class CombatEntity extends Entity{
    constructor(index){
        super(index);
        this.entityType = "CombatEntity";
        //stats
        this.maxHealth = 1200;
        this.maxMana = 200;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.moveSpeed = 4;
        //combat
        this.target = "None"
        this.range = 200;
        this.combatType = "range";
        this.attackDamage = 20;
        this.attackSpeed = 20;
        this.lastAttack = 0;
        this.attackPreDelay = 0;
        //combat //important only if combat type is range
        this.projectileSpeed = 4;
        //hp bar
        this.EntityInfoDisplay = new CombatEntityInfo(this);
    }

    renderObject(){
        super.renderObject();
        this.EntityInfoDisplay.renderObject();
    }

    dealDamage(damage){
        if(this.health >= damage)
        this.health -= damage;

    }

    tryToAttack(deltaTime, isRange){
        if(this.lastAttack > (1000 / this.attackSpeed)){
            if(this.attackPreDelay > (100 / this.attackSpeed)){
                if(!isRange) {
                    objects[this.target].dealDamage(this.attackDamage);
                }else{
                    let newProjectile = new Projectile(this, objects[this.target], this.projectileSpeed, this.attackDamage, objects.length);
                    pushObject(newProjectile);
                }
                this.attackPreDelay = 0;
                this.lastAttack = 0;
            }else{
                this.attackPreDelay += deltaTime;
            }
        }
    }

    combatTarget(deltaTime){
        if(this.target != "None"){
            if(objects[this.target] == undefined) return;
            if(objects[this.target].health <= 0) {
                this.target = "None";
                return;
            }
            let collided = false;
            objects.forEach(element => {
                if(mathhelper.CollisionDetection(this,element) && element!=this && cursor != element){
                    if(element.name == this.target.name) collided = true;
                    if(element.entityType == "CombatEntity" && !collided){
                        let destination = mathhelper.GetFacingVector(this, element);
                        this.move(destination.x*deltaTime,destination.y*deltaTime);
                    }
                }
    
            });
            if(!mathhelper.CollisionDetection(this,objects[this.target])){
                if(mathhelper.GetDistanceBetweenObjects(this,objects[this.target]) < this.range && this.combatType == "range"){
                    this.tryToAttack(deltaTime, true);
                }else{
                    let destination = mathhelper.GetFacingVector(this, objects[this.target]);
                    this.move(-destination.x*this.moveSpeed*deltaTime,-destination.y*this.moveSpeed*deltaTime);
                }
            }else if(this.combatType == "melee"){
                this.tryToAttack(deltaTime, false);
            }
        }
    }

    updateObject(deltaTime){
        this.lastAttack++;
        this.EntityInfoDisplay.updateObject(deltaTime);
    }

    renderObject(){
        
        if(Array.isArray(this.EntityInfoDisplay.renderObject())){
            let renderlist = this.EntityInfoDisplay.renderObject();
            renderlist.push({
                x: this.x,
                y: this.y,
                w: this.w,
                h: this.h,
                drawContent: this.drawContent
            });
            return renderlist;
        }else{
            return super.renderObject();
        } 
        
        
    }
}