import { Entity } from './bases/Entity.js';
import * as mathhelper from "/js/mathhelper.js";
import { objects, syncObjects } from "/js/wrapper.js";
import { Trash } from "/js/entities/Trash.js";

export class Projectile extends Entity{
    constructor(source, target, speed, damage, index){
        super();
        this.index = index;
        this.source = source;
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.w = 10;
        this.h = 10;
        this.x = source.ox - (this.w / 2);
        this.y = source.oy - (this.h / 2);
        this.updateCetralPosition();
        this.drawContent = "#ffff33";
        this.name = "Projectile";
    }
    
    updateObject(deltaTime){
        let destination = mathhelper.GetFacingVectorC(this, this.target);
        this.move(-destination.x*deltaTime*this.speed, -destination.y*deltaTime*this.speed);
    
        if(mathhelper.CollisionDetection(this,this.target)){
            this.target.dealDamage(this.damage);
            this.entityType = "TrashEntity";
            let objectsList = objects;
            objectsList[this.index] = new Trash();
            syncObjects(objectsList);
        }
    }
}