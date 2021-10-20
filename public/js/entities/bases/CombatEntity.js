import { Entity } from "/js/entities/bases/Entity.js";
import { CombatEntityInfo } from "/js/entities/CombatInfo.js";
import { objects, pushObject } from "/js/gamemodule.js";
import * as mathhelper from "/js/mathhelper.js";
import * as graphics from "/js/graphics.js";
import { cursor } from "/js/mouse.js";
import { Projectile } from "/js/entities/Projectile.js";
import { Hitbox } from "/js/entities/Hitbx.js";


export class CombatEntity extends Entity{
    constructor(){
        super();
        this.entityType = "CombatEntity";
        this.inPosition = false;
        //stats
        this.maxHealth = 1200;
        this.maxMana = 200;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.moveSpeed = 4;
        //combat
        this.target = "None"
        this.range = 200;
        this.isRange = false;
        this.attackDamage = 20;
        this.attackSpeed = 20;
        this.lastAttack = 0;
        this.attackPreDelay = 0;
        //combat //important only if combat type is range
        this.projectileSpeed = 4;
        //hp bar
        this.EntityInfoDisplay = new CombatEntityInfo(this);
        this.hitbox = new Hitbox(this);

        //spritesheet
        let spriteImage = new graphics.Sprite("/img/character/BODY_male.png");
        this.defaultSprites = new graphics.SpriteSheet(spriteImage, 4, 9, 64, 64);
        this.attackSprites = this.defaultSprites;
        this.drawContent = this.defaultSprites;

        this.currentFrame = 0;
        this.frameDelay = 5;
        this.frameClock = 0;
        this.playing = false;
        this.chasingTarget = false;
        this.chasingTargetOLD = false;
        this.finishingAtkAnim = false;

        this.deployAttackFrame = 8;
        this.attackAnimLength = 11;
    }

    bundle(){
        return [this, this.hitbox];
    }

    dealDamage(damage){
        if(this.health >= damage)
        this.health -= damage;

    }

    tryToAttack(deltaTime, isRange){
        this.playing = false;
        this.drawContent = this.defaultSprites;
        if(this.lastAttack > (1000 / this.attackSpeed)){

            this.drawContent = this.attackSprites;
            this.playing = true;

            if(this.currentFrame >= (this.deployAttackFrame)){
                if(!isRange) {
                    objects[this.target].dealDamage(this.attackDamage);
                }else if(!this.finishingAtkAnim){
                    let newProjectile = new Projectile(this, objects[this.target], this.projectileSpeed, this.attackDamage, objects.length);
                    pushObject(newProjectile);
                    this.finishingAtkAnim = true;
                }
                if(this.currentFrame == this.attackAnimLength){
                    this.finishingAtkAnim = false;
                    this.lastAttack = 0;
                }
                console.log(this.currentFrame);
            }else{
                this.attackPreDelay += deltaTime;
            }
        }
    }



    combatTarget(deltaTime){
        this.playing = false;
        if(this.target == "None") {
            this.chasingTarget = false;
        }
        if(this.target != "None"){
            if(objects[this.target] == undefined) return;
            if(objects[this.target].health <= 0) {
                this.target = "None";
                return;
            }else{
                this.drawContent = this.defaultSprites;
                this.playing = false;
            }
            let collided = false;
            objects.forEach(element => {
                if(mathhelper.CollisionDetection(this,element) && element!=this && cursor != element){
                    if(element.name == this.target.name) collided = true;
                    if(element.entityType == "CombatEntity" && !collided){
                        let destination = mathhelper.GetFacingVector(this, element);
                        this.move(destination.x*deltaTime,destination.y*deltaTime);
                        this.playing = true;
                        this.chasingTarget = true;
                    }
                }
    
            });
            if(!mathhelper.CollisionDetection(this,objects[this.target])){
                if(mathhelper.GetDistanceBetweenObjects(this,objects[this.target]) < this.range && this.isRange){
                    this.tryToAttack(deltaTime, true);
                }else{
                    let destination = mathhelper.GetFacingVector(this, objects[this.target]);
                    this.move(-destination.x*this.moveSpeed*deltaTime,-destination.y*this.moveSpeed*deltaTime);
                    this.playing = true;
                    this.chasingTarget = false;
                }
            }else if(!this.isRange){
                this.tryToAttack(deltaTime, false);
            }
        }
    }

    playingAnimation(deltaTime){
        if(this.playing){
            this.frameClock += deltaTime;
            if(this.frameClock > this.frameDelay){
                this.frameClock = 0;
                this.currentFrame++;
                if(this.currentFrame >= this.drawContent.columns) this.currentFrame = 0;
            }
        }else{
            this.currentFrame = 0;
        }

    }

    updateObject(deltaTime){
        this.playingAnimation(deltaTime);
        this.lastAttack++;
        this.EntityInfoDisplay.updateObject(deltaTime);
        if(this.chasingTargetOLD && !this.chasingTarget){
            this.currentFrame = 0;
        }
        this.chasingTargetOLD = this.chasingTarget;
        //this.hitbox.updateObject(deltaTime);
    }

    renderObject(){
        let renderlist = [];
        if(Array.isArray(this.EntityInfoDisplay.renderObject())){
            renderlist = this.EntityInfoDisplay.renderObject();
        }
        renderlist.push({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            drawContent: this.drawContent
        });
        
        /*renderlist.push({
            x: this.hitbox.x,
            y: this.hitbox.y,
            w: this.hitbox.w,
            h: this.hitbox.h,
            drawContent: this.hitbox.drawContent
        });*/

        return renderlist;
    }
}