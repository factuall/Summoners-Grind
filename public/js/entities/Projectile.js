import { Entity } from './bases/Entity.js';
import * as mathhelper from "/js/mathhelper.js";
import * as graphics from "/js/graphics.js";
import { objects } from "/js/gamemodule.js";
import { Trash } from "/js/entities/Trash.js";

export class Projectile extends Entity{
    constructor(source, target, speed, damage){
        super();
        this.index = 0;
        this.source = source;
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.w = 10;
        this.h = 10;
        this.x = source.ox - (this.w / 2);
        this.y = source.oy - (this.h / 2);
        this.updateCetralPosition();
        this.drawContent = new graphics.Sprite('/img/effects/spell1.png');
        this.name = "Projectile";
    }
    
    updateObject(deltaTime){
        let destination = mathhelper.GetFacingVectorC(this, this.target);
        this.move(-destination.x*deltaTime*this.speed, -destination.y*deltaTime*this.speed);
        if(mathhelper.CollisionDetection(this,this.target)){

            this.target.dealDamage(this.damage);
            this.entityType = "TrashEntity";
            
            objects[this.index] = new Trash();
        }
    }
}